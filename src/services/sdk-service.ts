import * as wallet from 'cryptofiat-wallet';
import { Injectable } from '@angular/core';
import { Transfer, TransferReference } from '../providers/transfer-data';

@Injectable()
export class SdkService {
  private sdk;

  constructor() {
    this.sdk =  new wallet.Application();
    this.sdk.attachStorage(window.localStorage);
  }

  initiated() : Boolean { //encryptedChallenge
    return this.sdk.initiated();
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

  privateToPublic(privKey : Uint8Array) : Uint8Array { 
    return this.sdk.privateToPublic(privKey);
  }

  pubToAddress(publicKey : Uint8Array) : string {
    return this.sdk.pubToAddress(publicKey).toString('hex');
  }

  approveWithEstonianMobileId(address : string, phoneNumber : string, callback) : Promise<Object> {
    return this.sdk.approveWithEstonianMobileId(address.slice(2), phoneNumber, callback);
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

  isUnlocked() : Boolean {
    return this.sdk.isUnlocked();
  }

  sendToEstonianIdCode(idCode, amount, ref) : Promise<Object> {
    return this.sdk.sendToEstonianIdCode(idCode, amount, ref)
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

  contractDataAsync() : Promise<Object> {
    return this.sdk.contractDataAsync()
  }

  getAddressForEstonianIdCode(idCode) : Promise<Object> {
    return this.sdk.getAddressForEstonianIdCode(idCode)
  }

  transferStatusAsync(transactionHash) : Promise<Object> {
    return this.sdk.transferStatusAsync(transactionHash)
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

  findAccountAndSendToBank(toIBAN, amount, ref, recipientName) : Promise<Object> {
    return this.sdk.findAccountAndSendToBank(toIBAN, amount, ref, recipientName);
  }
}
