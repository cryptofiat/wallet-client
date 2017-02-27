import * as wallet from 'cryptofiat-wallet';
import { Injectable } from '@angular/core';
import { Transfer, TransferReference } from '../providers/transfer-data';

@Injectable()
export class SdkService {
  private sdk;

  constructor() {
    this.sdk =  new wallet.Application();
    this.sdk.attachStorage(window.localStorage);
    this.sdk.attachSessionStorage(window.sessionStorage);
    //this.sdk.ID_SERVER = "http://localhost:8080/v1/";
  }

  initiated() : Boolean { //encryptedChallenge
    return this.sdk.initiated();
  }

  isUnlocked() : Boolean {
    return this.sdk.isUnlocked();
  }

  logout() : void {
    this.sdk.logout();
  }

  unlock(secret) : Boolean {
    return this.sdk.unlock(secret);
  }

  initLocalStorage(secret) : string { //encryptedChallenge
    return this.sdk.initLocalStorage(secret);
  }

  storeNewKey(newKeyHex : string) : Uint8Array {
    //TODO: should  only store in localStorage if the privKey is valid
    return this.sdk.storeNewKey(newKeyHex);
  }

  removeKey(privKeyHex : string) : void {
    return this.sdk.removeKey(privKeyHex);
  }

  privateToPublic(privKey : string) : Uint8Array { 
    return wallet.privateToPublic(privKey);
  }

  pubToAddress(publicKey : Uint8Array) : string {
    return this.sdk.pubToAddress(publicKey).toString('hex');
  }

  approveWithEstonianMobileId(address : string, phoneNumber : string, callback) : Promise<Object> {
    return this.sdk.approveWithEstonianMobileId(address.slice(2), phoneNumber, callback);
  }

  approveWithTest(address : string, idCode : string) : Promise<Object> {
    return this.sdk.approveWithTest(address,idCode);
  }

  approveWithEstonianIdCard(address : string) : Promise<Object> {
    return this.sdk.approveWithEstonianIdCard(address.slice(2));
  }

  approveWithEstonianBankTransfer(publicAddress) : Promise<Object> {
    return this.sdk.approveWithEstonianBankTransfer(publicAddress);
  }

  balanceTotalAsync() : Promise<number> {
    return this.sdk.balanceTotalAsync();
  }

  sendToEstonianIdCode(idCode : string, amount : number, ref : string) : Promise<string> {
    return this.sdk.sendToEstonianIdCode(idCode, amount, ref).then((response) => {
       return response.id;
    });
  }

  sendAsync(toAddress, amount, ref) : Promise<Object> {
    return this.sdk.sendAsync(toAddress, amount, ref, {})
  }

  storeEstonianIdCode(idCode) : Boolean {
    return this.sdk.storeEstonianIdCode(idCode)
  }
  getEstonianIdCode() : string { //estonia id code
    return this.sdk.getEstonianIdCode()
  }

  getSecret() : string { //retrieve password from sessionStorage
    return this.sdk.getSecret()
  }

  addresses() : Array<string> {
    return this.sdk.addresses()
  }

  transfersCleanedAsync() : Promise<Transfer[]> {
    //TODO: if wallet-sdk was typescript should move this upstream
    let txs : Array<Transfer> = [];
    let jsonHolder : any[];
    let transfer : Transfer;
    let transferRef : TransferReference;
    return this.sdk.transfersCleanedAsync().then( (jsonTxs) => {
       jsonHolder = jsonTxs;
       jsonHolder.forEach((jsonTx) => { 
	   //This magic here expects that wallet-sdk uses exact same naming
	   transfer = new Transfer();
	   transferRef = new TransferReference();
	   transferRef = Object.assign({},jsonTx.ref);
	   transfer = Object.assign({},jsonTx, { 
	        counterPartyAddress : jsonTx.otherAddress, // should change in sdk
		ref:  null
	   });
	   transfer.ref = transferRef;
           txs.push(transfer);
       } );
       return txs;
    });
  }

  contractDataAsync() : Promise<Object[]> {
    return this.sdk.contractDataAsync()
  }

  //Highest balance of an account, until support multi-send
  availableBalanceToSend() : Promise<number> {
    return this.contractDataAsync().then( (contracts : { balance : number }[]) => {
      return Math.max.apply(Math, contracts.map( (c) => {return c.balance;}));
    }); 
  }

  getAddressForEstonianIdCode(idCode : string, escrow : boolean) : Promise<Object> {
    return this.sdk.getAddressForEstonianIdCode(idCode, escrow)
  }

  generateEscrow(idCode :string) : Promise<Object> {
    return this.sdk.generateEscrow(idCode);
  }

  transferStatusAsync(transactionHash : string) : Promise<string> {
    return this.sdk.transferStatusAsync(transactionHash).then( (tx) => {
        return tx.status;
    });
  }

  referenceSendAsync(transactionHash,senderIdCode,receiverIdCode,referenceText,referenceCode,attachments) : Promise<Object> {
    return this.sdk.referenceSendAsync(transactionHash,senderIdCode,receiverIdCode,referenceText,referenceCode,attachments)
  }

  referenceAsync(transactionHash) : Promise<Object> {
    return this.sdk.referenceAsync(transactionHash)
  }

  nameFromIdAsync(idCode) : Promise<Object> {
    return this.sdk.nameFromIdAsync(idCode)
  }

  findAccountAndSendToBank(toIBAN, amount, ref, recipientName) : Promise<string> {
    return this.sdk.findAccountAndSendToBank(toIBAN, amount, ref, recipientName).then( (response) => {
        return response.id;
    });
  }

  // Penging Transfers <<= this part should move to wallet-sdk

  storePendingTransfer(tx : Transfer){
      return this.sdk.pending.storePendingTransfer(tx);
  }

  removePendingTransfer(txHash : string){
      return this.sdk.pending.removePendingTransfer(txHash);
  }

  getPendingTransfers() : Array<Transfer> {
      let temp : Array<Transfer> = this.sdk.pending.getPendingTransfers();
      return temp;
   /*   return temp.map( (tx) => {
		if (!tx.signedAmount && tx.amount) {tx.signedAmount = tx.amount};
		if (!tx.ref) {tx.ref = new TransferReference()};
		return tx;
	});
   */
  }

  getPendingTotal() : number {
      if(this.getPendingTransfers() == null ) return 0;
      if(this.getPendingTransfers().length == 0 ) return 0;
      return this.sdk.pending.getPendingTotal();
  }
  // END Pending TX


  // Penging Approvals <<= this part should move to wallet-sdk
  // Should make a keys domain object key.private, key.public, key.approvalHash, key.pending ..

  storePendingApproval(txHash : string, addr : string) {
     this.sdk._storage.setItem('pendingApproval:'+addr,txHash); 
  }

  removePendingApproval(addr : string) {
     this.sdk._storage.removeItem('pendingApproval:'+addr); 
  }

  getPendingApproval(addr : string) : string {
     return this.sdk._storage.getItem('pendingApproval:'+addr); 
  }

  pendingApprovalArray() : Array<string> {
     return this.addresses().filter( (addr) => { 
		return (this.getPendingApproval(addr) != undefined)
	} );
  }
  // END Pending Approval

  escrowToPending(str : any) : void {
      return this.sdk.escrowToPending(str);
  }

  hasBackup(idCode : string) : Promise<boolean> {
      return this.sdk.backup.hasBackup(idCode);
  }
  backupInit(password:string, idCode : string) : Promise<boolean> {
      return this.sdk.backup.setFirstPassword(password,idCode);
  }
  backupVerifyPassword(password:string, idCode : string) : Promise<boolean> {
      return this.sdk.backup.verifyPassword(password,idCode);
  }
  backupSyncAll(password:string, idCode : string) : Promise<Object> {
      return this.sdk.syncAllKeys(password,idCode);
  }

}
