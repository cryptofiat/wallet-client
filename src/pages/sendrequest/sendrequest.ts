import { Component } from '@angular/core';
import { Validators,  FormControl, FormBuilder, FormGroup, AsyncValidatorFn,ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { Events, NavParams, NavController,ToastController } from 'ionic-angular';
import { SdkService } from "../../services/sdk-service";
import { Transfer } from "../../providers/transfer-data";
import { EscrowNotification } from '../../providers/escrow-data';
import { SendResponse } from '../../providers/response-data';
import { RecipientSearchPage } from "../search/search";

// Murky way to do validation, because Validator doesn't have access to instance scope and "this."

export function amountValidator(availableSpend : Promise<number>, fg : FormGroup) : AsyncValidatorFn {
	return (c : FormControl) : Promise<ValidationErrors> => {
    return availableSpend.then( (avail) => {
	    return ( (c.value * 100 + fg.controls.fee.value * 100) > avail) ? {'amount': 'Not enough to spend.'} : null;
    });
  }
} 


@Component({ selector: 'page-send', templateUrl: 'sendrequest.html' })
export class SendRequestPage {

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
      escrowEmail? : string,
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


  constructor(
     private sdk: SdkService, 
     private navCtrl: NavController, 
     private navParams: NavParams, 
     private toastCtrl: ToastController,
     private formBuilder: FormBuilder,
     private events: Events
  ) {
    sdk.availableBalanceToSend().then( (n) => this.availableToSend = n/100);
    this.send.euroAmount = navParams.get("amount")/100;
    this.send.eId = navParams.get("idCode");
    this.send.reference = navParams.get("referenceText");
    this.idCodeChecker();

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
      escrowEmail: [''],
    //  destination: ['eId'],
      fee: [''],
    });
    this.setFeeInput()

  }

  getSelectedFee() : number {
    return (this.destination == 'eId') ? this.fee : this.bankFee;
  }
  setFeeInput() {
    // murky workaround because don't know how to reference other form element values in template
    this.sendForm.controls.fee.setValue(this.getSelectedFee());
  }

  getAvailableToSpend() : number {
    return this.availableToSend;
  }

  sendPaymentRequest() {
    console.log('sending: ', this.send);
    console.log('sending sendForm: ', this.sendForm.value);

        this.txState = "submitting";
        let promise: Promise<SendResponse> = this.sdk.sendPaymentRequest(100 * this.send.euroAmount, this.send.reference);

        promise.then( (sendResponse) => {
          this.txState = "submitted";  

  		    this.toastCtrl.create({message: 'submitted ' + this.txHash, duration: 3000});

  		    this.navCtrl.pop();
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
		    setTimeout( () => this.generateRefresh = false , 200);
	}, () => this.generateRefresh = false);
      });
  }

  searchCallback = (idCode : string) => {
    return new Promise( (resolve,reject) => {
      this.sendForm.controls.eId.setValue(String(idCode));
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
             return;
          }
          this.idCodeCheck = "loading";

          this.sdk.nameFromIdAsync(this.send.eId).then( (nameJson) => {
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
