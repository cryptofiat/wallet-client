import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Events, NavController,ToastController } from 'ionic-angular';
import { SdkService } from "../../services/sdk-service";
import { Transfer } from "../../providers/transfer-data";

@Component({
  selector: 'page-send',
  templateUrl: 'send.html'
})
export class SendPage {

  //TODO: should read them from wallet-server/fees through sdk
  fee :number = 0.01;
  bankFee :number = 0.05;
  txState : string;
  destination : string = "eId";
  idCodeCheck : string;
  txHash : string;
  send : {
      toIban? : string,
      eId? : string,
      recipientName? : string,
      reference? : string,
      euroAmount? : number
  } = {};

  pendingCheck: any;
  pendingRefresh: boolean;
  generateRefresh: boolean;
  generating: boolean;
  checkAction: any;
  err:string;
  escrowTx:string;
  idRecipient : { firstName?: string, lastName? : string} = {};

  escrowCreate: boolean;

  constructor(
     private sdk: SdkService, 
     private navCtrl: NavController, 
     private toastCtrl: ToastController,
     private events: Events
  ) {
  }

  sendEuro() {
    console.log('sending: ', this.send);

            this.txState = "submitting";
            let promise : Promise<string>;
            if (this.destination == 'eId') {
                promise = this.sdk.sendToEstonianIdCode(this.send.eId, 100 * this.send.euroAmount, this.send.reference)
	    } else {
                promise = this.sdk.findAccountAndSendToBank(this.send.toIban, 100 * this.send.euroAmount, this.send.reference, this.send.recipientName)
	    }
	    console.log("promise now is: ", promise);
	    if (!promise) {return};
            promise.then( (transactionHash : string) => {
		  if (transactionHash) {
                    this.txHash = transactionHash;
                    this.txState = "submitted";

                    let pendingTx : Transfer = new Transfer();
                    pendingTx.amount = 100 * this.send.euroAmount;
                    pendingTx.signedAmount = - pendingTx.amount;
                    pendingTx.transactionHash = transactionHash;
                    if (this.send.eId) pendingTx.counterPartyIdCode = this.send.eId;
                    this.sdk.storePendingTransfer(pendingTx);
                    this.events.publish("tx:newPending");
		    this.toastCtrl.create({message: 'submitted ' + transactionHash, duration: 3000});
		    this.navCtrl.pop();
/*
		    this.pendingCheck = Observable.interval(5000).take(15);
                    this.checkAction = this.pendingCheck.subscribe(
                      (x) => {
			console.log("refresh try: ", x);
			this.pendingRefresh = true;
			this.sdk.transferStatusAsync(this.txHash).then( (txCheckStatus : string) => {

			    console.log("got back tx status: ",txCheckStatus);

			    if (txCheckStatus != "PENDING") {
			        console.log("should NOT be pending: ",txCheckStatus);
				this.txState = "confirmed";
				this.checkAction.unsubscribe();
				this.pendingCheck = undefined;
			    } else {
			        console.log("should be pending: ",txCheckStatus);
			    }
		            console.log("checked tx status: ", txCheckStatus)
			    this.pendingRefresh = false;
			});
		    });
*/
                  }
               }, (err) => {
                    this.err = err; 
                    this.txState = "error";
               });
  }

  generateNewEscrow() {
    this.sdk.generateEscrow(this.send.eId).then( (json : {transactionHash?:string}) => {
        console.log("creating escrow", json);
        this.generating = true;
        this.escrowTx = json.transactionHash;
        this.pendingPolling(this.escrowTx);
	this.idCodeChecker();
    });
  }

  pendingPolling(txHash : string) {
      let pendingCheck = Observable.interval(10000).take(25);
      let checkAction = pendingCheck.subscribe( (x) => {
        if (!this.generating) {
		checkAction.unsubscribe();
		pendingCheck = undefined;
        }
	console.log("pending refresh try: ", x);
	this.generateRefresh = true;
        this.sdk.transferStatusAsync(txHash).then( (txCheckStatus : string) => {

		    console.log("got back tx status: ",txCheckStatus);

		    if (txCheckStatus != "PENDING") {
                        this.generating=false;
		        this.toastCtrl.create({message: 'Confirmed ' + txHash, duration: 5000});
		    } else {
		    }
		    this.generateRefresh = false;
	});
      });
  }

  idCodeChecker() {
          if (this.send.eId.length != 11) {
             this.idCodeCheck="";
             return;
          }
          this.idCodeCheck = "loading";

          this.sdk.nameFromIdAsync(this.send.eId).then( (nameJson) => {
                console.log("json responded for "+this.send.eId+": ",nameJson)
              	this.idRecipient = nameJson;
		if (nameJson && this.idRecipient.lastName) {
                  this.sdk.getAddressForEstonianIdCode(this.send.eId,false).then( (addr) => {
                     if (addr) {
                        this.idCodeCheck = "yes" 
                     } else {
			this.escrowCreate = false;
                        this.idCodeCheck = "escrow"; 
                        this.sdk.getAddressForEstonianIdCode(this.send.eId, true).then( (escrowAddr) => {
                          if (!escrowAddr) {
			    this.escrowCreate = true;
                          }
                        });
                     }
                   });
                } else {
                  this.idRecipient = {};
                  this.idCodeCheck = "no" 
                }
          });

   }
}
