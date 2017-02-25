import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { Events, ToastController, NavController } from 'ionic-angular';
import { SdkService } from '../../services/sdk-service';
import { Transfer } from '../../providers/transfer-data';
import { SendPage } from '../send/send';
import { TopupPage } from '../topup/topup';
import { SprayerPage } from '../sprayer/sprayer';

/*
  To learn how to use third party libs in an
  Ionic app check out our docs here: http://ionicframework.com/docs/v2/resources/third-party-libs/
*/
import moment from 'moment';

@Component({ selector: 'page-transfers', templateUrl: 'transfers.html' })
export class TransfersPage {

  owner : { firstName?: string, lastName? : string} = {};
  idCode: string;
  totalBalance: number;
  totalPending : number;
  enableRemoveButtonTime : number = Date.now() - 600000; // allow stop watching after 10min
  transfers : Transfer[] = [];
  pendingTransfers : Transfer[] = [];
  refreshing : boolean = false;

  constructor(
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    public events: Events,
    public sdk: SdkService
  ) {
        this.idCode = this.sdk.getEstonianIdCode();
        this.loadData(null)
        this.sdk.nameFromIdAsync(this.idCode).then( (nameJson) => {
          this.owner = nameJson;
        });
        events.subscribe('tx:newPending', () => this.refreshPending());
  }

  loadData(refresher) {
        this.refreshing = true;
        this.sdk.balanceTotalAsync().then((amount) => {
            this.totalBalance = amount;
        });
	this.refreshPending();

        this.sdk.transfersCleanedAsync().then((tx) => {
	    if (tx) {
                this.transfers = tx.sort(function(a,b) { return a.timestamp-b.timestamp; } ).reverse();
            }
            this.refreshing = false;
	    if (refresher) { refresher.complete(); }
        })
  }

  getFormattedDate(tx : Transfer) : string {
        return moment(tx.timestamp).fromNow();
  }

  toBankUpload() {
    this.navCtrl.push(TopupPage);
  }

  toSprayer() {
    this.navCtrl.push(SprayerPage);
  }

  toSendPage() {
    this.navCtrl.push(SendPage);
  }

  ionViewCanEnter() : boolean {
    //blocks access if logged out
    return !!this.sdk.isUnlocked();
  }

  private refreshPending() {
      this.enableRemoveButtonTime = Date.now() - 600000;
      this.pendingTransfers = this.sdk.getPendingTransfers();
      this.totalPending = this.sdk.getPendingTotal();
      if (!this.pendingTransfers) { return };
      console.log("starting to refresh  pending for amount: ", this.totalPending);

      let pendingCheck = Observable.interval(10000).take(25);
      let checkAction = pendingCheck.subscribe(
       (x) => {
        if (this.pendingTransfers == null || this.pendingTransfers.length == 0) {
		checkAction.unsubscribe();
		pendingCheck = undefined;
        }
	console.log("Pending refresh TX try: ", x);
        this.pendingTransfers.map( (pendingTx) => {
	        pendingTx.pendingRefresh = true;
		this.sdk.transferStatusAsync(pendingTx.transactionHash).then( (txCheckStatus : string) => {

		    console.log("got back tx status: ",txCheckStatus);

		    if (txCheckStatus != "PENDING") {
                        this.sdk.removePendingTransfer(pendingTx.transactionHash);
		        this.toastCtrl.create({message: 'Confirmed ' + pendingTx.transactionHash, duration: 5000});
                        this.loadData(null);
		    } else {
		    }
                    this.pendingTransfers = this.sdk.getPendingTransfers();
                    this.totalPending = this.sdk.getPendingTotal();
		    pendingTx.pendingRefresh = false;
		});
	});
      });
  };

  removePending(txhash : string) : void {
      this.sdk.removePendingTransfer(txhash);
      this.refreshPending();
  }

  testit() {
    var arr = [{amount: 32, transactionHash:'0x223'},{amount:33, transactionHash: '0x444'}];
    this.sdk.escrowToPending(arr);
    this.refreshPending()

  }
}
