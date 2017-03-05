import { Transfer } from "./transfer-data";
import {Injectable} from '@angular/core';

@Injectable()
export class EscrowNotification {

  public transactionHash : string; //0x..
  public escrowAddress : string; //0x..

  public amount : number; //EUR_CENT 
  public email : string; //0x..

  public senderFirstName : string; // Mari-Liis
  public senderLastName : string; // Männnik
  public recipientFirstName : string; // Mari-Liis
  public recipientLastName : string; // Männnik

  constructor( tx : Transfer, email : string) {
    this.email = email;
    this.amount = tx.amount;
    this.transactionHash = tx.transactionHash;
    this.escrowAddress = tx.targetAccount;
  }

}
