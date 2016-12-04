import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Events, ToastController,NavController, NavParams } from 'ionic-angular';
import { SdkService } from "../../services/sdk-service";
import { TransfersPage } from "../transfers/transfers";

@Component({
  selector: 'page-verify',
  templateUrl: 'verify.html'
})
export class VerifyPage {
  tab : string = "ACCOUNT_CREATED";
  mobileId: {phoneNumber?: string} = {};

  private privKey : string;
  public publicKey : Uint8Array;
  public publicAddress : string;
  public processing : boolean;
  public refreshing : boolean;
  public mobileIdChallengeCode : string;
  public idNumber : string;
  public pendingApprovals : Array<string> = [];
  public escrowAmount : number;
  public escrow : boolean;

  constructor(private events : Events, private toastCtrl: ToastController, private navCtrl: NavController, private sdk: SdkService, public params: NavParams) {
 	this.privKey = params.get("privKey");
	if (this.privKey) {
	   this.publicKey = this.sdk.privateToPublic(this.privKey);
	} else {
           this.publicKey = this.sdk.storeNewKey(null);
        }
        this.publicAddress = '0x'+this.sdk.pubToAddress(this.publicKey);
  }

  showTab(tab : string) {
      this.tab = tab;
  }
  testit() {
      let testID : string = "38008030232";	
      let testAddr : string = "0x833898875a12a3d61ef18dc3d2b475c7ca3a4a72";	
      let pendingBefore : number = this.sdk.getPendingTotal();
	console.log("starting to test");
            this.sdk.approveWithTest(testAddr,testID).then( 
              (res : {ownerId?: string, transactionHash?: string} ) => {
              console.log("id  returned: ",res.ownerId, " with hash ", res.transactionHash); 
              let pendingAfter : number = this.sdk.getPendingTotal();
	      if  (pendingBefore < pendingAfter) {
	          this.escrow = true;
	          this.escrowAmount = pendingAfter - pendingBefore;
	      }
              this.idNumber = res.ownerId;
              this.processing = false;
       	      this.sdk.storeEstonianIdCode(res.ownerId);
       	      this.sdk.storePendingApproval(res.transactionHash,this.publicAddress);
              this.tab = 'USE';
              this.events.publish("tx:newPending");
	      this.refreshApprovals();
	      this.pendingPolling();
            });
  }

  verifyMobileId() {
            if(this.mobileId.phoneNumber){
		this.processing = true;
                this.sdk.approveWithEstonianMobileId(this.publicAddress ,this.mobileId.phoneNumber,
                    (data) => {
                       this.mobileIdChallengeCode = data.mobileIdChallengeCode;
                       console.log('mobileIdChallengeCode', data.mobileIdChallengeCode)
                       //$scope.$apply();
                    }
                ).then((res : {ownerId?: string, transactionHash?: string} ) => {
                    this.idNumber = res.ownerId;
                    console.log("approve estonia mobile id had a response: " + this.idNumber);
		    this.sdk.storeEstonianIdCode(this.idNumber);
       	            this.sdk.storePendingApproval(res.transactionHash,this.publicAddress);
                    this.processing = false;
                    this.tab = 'USE';
                },(err) => {
		    console.log("error: ",err)
                    this.processing = false;
		})

            } else {
                console.log('no phone number given...');
            }
  }

  verifyCard() {
            console.log('verify by card');
            this.processing = true;
	    //TODO: change account-identity server call to accept '0x' in hex
            this.sdk.approveWithEstonianIdCard(this.publicAddress).then( 
              (res : {ownerId?: string, transactionHash?: string} ) => {
              console.log("id  returned: ",res.ownerId, " with hash ", res.transactionHash); 
              this.idNumber = res.ownerId;
              this.processing = false;
       	      this.sdk.storeEstonianIdCode(res.ownerId);
       	      this.sdk.storePendingApproval(res.transactionHash,this.publicAddress);
              this.tab = 'USE';
	      this.refreshApprovals();
	      this.pendingPolling();
            });
  }

  refreshApprovals() {
    this.pendingApprovals = this.sdk.pendingApprovalArray();
  }

  getPendingApproval(addr : string) : string {
    return this.sdk.getPendingApproval(addr);
  }

  finish() {
    this.navCtrl.setRoot(TransfersPage);
  }

  pendingPolling() {
      let pendingCheck = Observable.interval(10000).take(25);
      let checkAction = pendingCheck.subscribe( (x) => {
        if (this.pendingApprovals == null || this.pendingApprovals.length == 0) {
		checkAction.unsubscribe();
		pendingCheck = undefined;
        }
	console.log("pending refresh try: ", x);
	this.refreshing = true;
        this.pendingApprovals.map( (addr) => {
		this.sdk.transferStatusAsync(this.getPendingApproval(addr)).then( (txCheckStatus : string) => {

		    console.log("got back tx status: ",txCheckStatus);

		    if (txCheckStatus != "PENDING") {
                        this.sdk.removePendingApproval(addr);
		        this.toastCtrl.create({message: 'Confirmed ' + addr, duration: 5000});
                        this.refreshApprovals();
		    } else {
		    }
		    this.refreshing = false;
		});
	});
      });
  }
}
