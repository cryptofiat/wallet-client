import { Component } from '@angular/core';
import { Validators,  FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Events, NavController,ToastController } from 'ionic-angular';
import { SdkService } from "../../services/sdk-service";
import { Transfer } from "../../providers/transfer-data";
import { RecipientSearchPage } from "../search/search";

// Murky way to do validation, because Validator doesn't have access to instance scope and "this."

export function amountValidator(availableSpend : Promise<number>, fg : FormGroup) {
  return (c : FormControl) : {[key: string]: any} => {
    return availableSpend.then( (avail) => {
	    return ( c.value * 100 + fg.controls.fee.value * 100 > avail) ? {'amount': 'Not enough to spend.'} : null;
    });
  }
} 


@Component({ selector: 'page-send', templateUrl: 'send.html' })
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
  private sendForm : FormGroup;

  availableToSend : number = 0;
  pendingCheck: any;
  pendingRefresh: boolean;
  generateRefresh: boolean;
  generating: boolean;
  checkAction: any;
  err:string;
  escrowTx:string;
  escrowCreate: boolean;
  idRecipient : { firstName?: string, lastName? : string} = {};
  recipientSearch : {name:string,id:number}[] = [{name: "Kristo", id: 38008030265},{name: "Kriss", id:48608260297}];

  constructor(
     private sdk: SdkService, 
     private navCtrl: NavController, 
     private toastCtrl: ToastController,
     private formBuilder: FormBuilder,
     private events: Events
  ) {
    sdk.availableBalanceToSend().then( (n) => this.availableToSend = n/100);

    this.sendForm = formBuilder.group({
      eId: ['', Validators.compose([Validators.minLength(11),Validators.maxLength(11)])],
      euroAmount: ['', Validators.compose([
		Validators.required,
		Validators.pattern('[0-9\.]+'), 
		]),
		],
      reference: [''],
      recipientName: [''],
      toIban: [''],
    //  destination: ['eId'],
      fee: [''],
    });
    this.sendForm.controls.euroAmount.setAsyncValidators(amountValidator(sdk.availableBalanceToSend(),this.sendForm));
  }

  getSelectedFee() : number {
    return (this.destination == 'eId') ? this.fee : this.bankFee;
  }
  setFeeInput() {
    // murky workaround because don't know how to reference other form element values in template
    this.sendForm.controls.fee.setValue(this.getSelectedFee());
  }

  getAvailableToSpend() : number {
    console.log("avail: ",this.availableToSend);
    return this.availableToSend;
  }

  sendEuro() {
    console.log('sending: ', this.send);
    console.log('sending sendForm: ', this.sendForm.value);

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
                    pendingTx.timestamp = + new Date();
                    if (this.send.eId) pendingTx.counterPartyIdCode = this.send.eId;
                    this.sdk.storePendingTransfer(pendingTx);
                    this.events.publish("tx:newPending");
		    this.toastCtrl.create({message: 'submitted ' + transactionHash, duration: 3000});
		    this.navCtrl.pop();
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

  searchCallback = (idCode : string) => {
    return new Promise( (resolve,reject) => {
      this.sendForm.controls.eId.setValue(idCode);
      this.idCodeChecker();
      resolve();
    });
  }

  showSearch() {
    this.navCtrl.push(RecipientSearchPage, { callback: this.searchCallback });
  }

  idCodeChecker() {
          if (String(this.send.eId).length != 11) {
             this.idCodeCheck="";
             console.log("inside check: ", this.send.eId, " length ", this.send.eId.length);
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
