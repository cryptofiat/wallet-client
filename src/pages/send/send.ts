import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SdkService } from "../../services/sdk-service";

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
  checkAction: any;
  err:string;

  constructor(private sdk: SdkService) {
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
		    this.pendingCheck = Observable.timer(5000);
                    this.checkAction = this.pendingCheck.subscribe(
                      (x) => {
			console.log("refresh try: ", x);
			this.pendingRefresh = true;
			this.sdk.transferStatusAsync(this.txHash).then( (txCheckStatus : string) => {
			    if (txCheckStatus != "PENDING") {
				this.txState = "confirmed";
				this.checkAction.unsubscribe();
				this.pendingCheck = undefined;
			    } else {
			    }
		            console.log("checked tx status: ", txCheckStatus)
			    this.pendingRefresh = false;
			});
		    });

                  }
               }, (err) => {
                    this.err = err; 
                    this.txState = "error";
               });
  }

  idCodeChecker() {
          if (this.send.eId.length != 11) {
             this.idCodeCheck="";
             return;
          }
          this.idCodeCheck = "loading";

          this.sdk.getAddressForEstonianIdCode(this.send.eId).then( (addr) => {
            if (addr) {
              this.idCodeCheck = "yes" 
            } else {
              this.idCodeCheck = "no" 
            }
          })
   }
}
