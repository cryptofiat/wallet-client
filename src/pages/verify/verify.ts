import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SdkService } from "../../services/sdk-service";
import { AboutPage } from "../about/about";

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
  public mobileIdChallengeCode : string;
  public idNumber : string;

  constructor(private navCtrl: NavController, private sdk: SdkService, public params: NavParams) {
 	this.privKey = params.get("privKey");
	if (this.privKey) {
	   console.log("re-verifying key: ", this.privKey);
	   this.publicKey = this.sdk.privateToPublic(this.privKey);
	} else {
           this.publicKey = this.sdk.storeNewKey(null);
        }
        this.publicAddress = '0x'+this.sdk.pubToAddress(this.publicKey);
  }

  showTab(tab : string) {
      this.tab = tab;
  }

  verifyMobileId() {
            if(this.mobileId.phoneNumber){
		this.processing = true;
                console.log('phoneNumber: ' + this.mobileId.phoneNumber);
		console.log('submitting addr: ' + this.publicAddress);
                this.sdk.approveWithEstonianMobileId(this.publicAddress ,this.mobileId.phoneNumber,
                    (data) => {
                       this.mobileIdChallengeCode = data.mobileIdChallengeCode;
                       console.log('mobileIdChallengeCode', data.mobileIdChallengeCode)
                       //$scope.$apply();
                    }
                ).then((ownerId) => {
                    this.idNumber = ownerId.toString();
                    console.log("approve estonia mobile id had a response: " + ownerId);
		    this.sdk.storeEstonianIdCode(ownerId);
                    this.processing = false;
                    this.tab = 'USE';
                    console.log("tab: "+this.tab);
                    //$scope.$apply();
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
            this.sdk.approveWithEstonianIdCard(this.publicAddress).then( (ownerId) => {
              console.log("id  returned: ",ownerId); 
              this.processing = false;
       	      this.sdk.storeEstonianIdCode(ownerId);
              this.tab = 'USE';
            });
  }

  finish() {
    this.navCtrl.push(AboutPage);
  }

  testSdk() {
  }
}
