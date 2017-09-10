import { Component } from '@angular/core';
import { Validators,  FormControl, FormBuilder, FormGroup, AsyncValidatorFn,ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { Events, NavParams, NavController,ToastController } from 'ionic-angular';
import { SdkService } from "../../services/sdk-service";
import { Transfer } from "../../providers/transfer-data";
import { EscrowNotification } from '../../providers/escrow-data';
import { SendResponse } from '../../providers/response-data';
import { RecipientSearchPage } from "../search/search";



@Component({ selector: 'page-send', templateUrl: 'sendrequest.html' })
export class SendRequestPage {

  idCodeCheck : string;
  txHash : string;
  request : {
      eId? : string,
      reference? : string,
      euroAmount? : number
  } = {};
  requestUri : {
      paymentUri? : string,
      paymentUrl? : string,
      UriPath? : string,
  } = {};
  private sendForm : FormGroup;

  confirmed : boolean = false;
  idRecipient : { firstName?: string, lastName? : string} = {};


  constructor(
     private sdk: SdkService, 
     private navCtrl: NavController, 
     private navParams: NavParams, 
     private toastCtrl: ToastController,
     private formBuilder: FormBuilder,
     private events: Events
  ) {
    this.request.euroAmount = navParams.get("amount")/100;
    this.request.eId = navParams.get("idCode");
    this.request.reference = navParams.get("referenceText");
    this.request.eId = this.sdk.getEstonianIdCode();
    this.sdk.nameFromIdAsync(this.request.eId).then((nameJson) => {
      this.idRecipient = nameJson;
    });
   
  }


  sendPaymentRequest() {

        this.confirmed = true;
	//let promise: Promise<SendResponse> = this.sdk.sendPaymentRequest(100 * this.send.euroAmount, this.send.reference);
	this.requestUri = this.sdk.requestUriJson(100 * this.request.euroAmount, this.request.reference);
	console.log("paymentURI: ", this.requestUri.paymentUri);

  }
  sharePaymentRequest() {
  }
  copyToClipboard() {
  }
}
