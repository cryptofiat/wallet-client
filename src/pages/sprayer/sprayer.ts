import {Component} from '@angular/core';
import {SdkService} from '../../services/sdk-service';
import {Events, NavController, ToastController} from "ionic-angular";
import {Transfer} from "../../providers/transfer-data";
import {LdapResponse} from "../../providers/response-data";

@Component({ selector: 'page-sprayer', templateUrl: 'sprayer.html' })
export class SprayerPage {
  idCode: string;
  amount: number;
  txHash: string;
  SPRAYER_ADDRESS = "0x90d0e61c5846780a6608bacbd77633b067bb13fc";
  SPRAYER_ID = "99900010050"
  constructor(
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    private sdk: SdkService,
    private events: Events
  ) {
        this.idCode = this.sdk.getEstonianIdCode();
        this.amount = 0.01;
  }

  requestSpray() {
    this.sdk.spray(this.idCode, this.amount).then((o :{txHash : string}) => {
      this.txHash = o.txHash;

      let pendingTx: Transfer = new Transfer();
      pendingTx.amount = 100 * this.amount;
      pendingTx.signedAmount = pendingTx.amount;
      pendingTx.transactionHash = this.txHash;
      this.sdk.getAddressForEstonianIdCode(this.idCode, false).then((addr) => {
        pendingTx.targetAccount = String(addr);
      });
      pendingTx.sourceAccount = this.SPRAYER_ADDRESS;
      pendingTx.timestamp = +new Date();
      pendingTx.ref.senderIdCode = this.SPRAYER_ID;
      pendingTx.counterPartyIdCode = this.idCode;
      this.sdk.nameFromIdAsync(this.idCode).then((names: LdapResponse) => {
        pendingTx.counterPartyFirstName = names.firstName;
        pendingTx.counterPartyLastName = names.lastName;
      });
      this.sdk.referenceAsync(this.txHash).then((transferInfo: Object) => {
        pendingTx.ref.referenceText = transferInfo['referenceText'];
      });

      this.sdk.storePendingTransfer(pendingTx);
      this.events.publish("tx:newPending");
      this.toastCtrl.create({message: 'submitted ' + this.txHash, duration: 3000});
    }, ( o : {message : string, status : number}) => {
      console.log("Failed spray "+ o.message);
      this.toastCtrl.create({message: 'Failed with ' + o.status + ' and ' + o.message, duration: 3000});
    })

    //disable navigating to sprayer for current user
    this.navCtrl.popToRoot();
  }

}
