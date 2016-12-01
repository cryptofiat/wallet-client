import {Injectable} from '@angular/core';

@Injectable()
export class Transfer {

  public transactionHash : string; //0x..
  public timestamp : number; //12302329

  public amount : number; //EUR_CENT 
  public signedAmount : number; //EUR_CENT 
  public fee : number; //EUR_CENT
  public sourceAccount : string; //0x..
  public targetAccount : string; //0x..

  public counterPartyAddress : string; //0x..
  public counterPartyFirstName : string; // Mari-Liis
  public counterPartyLastName : string; // Männnik
  public counterPartyIdCode : string; // 38008062393

  public ref : TransferReference;

  public pendingRefresh : boolean; // for UI convenience

  constructor() {
     this.ref = new TransferReference();
  }

}

@Injectable()
export class TransferReference {

  public senderIdCode : string; //382008063492
  public receiverIdCode : string; //38008063492
  public referenceText : string; // e.g. for milk


  constructor() {
  }

}
