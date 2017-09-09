import {Component} from '@angular/core';
import {Observable} from 'rxjs';

import {Events, ToastController, NavController, Platform} from 'ionic-angular';
import {SdkService} from '../../services/sdk-service';
import {Transfer} from '../../providers/transfer-data';
import {SendRequestPage} from '../sendrequest/sendrequest';
import {TopupPage} from '../topup/topup';
import {SprayerPage} from '../sprayer/sprayer';
import {AlertController} from 'ionic-angular';
import { Push, PushToken } from '@ionic/cloud-angular';
/*
 To learn how to use third party libs in an
 Ionic app check out our docs here: http://ionicframework.com/docs/v2/resources/third-party-libs/
 */
import moment from 'moment';

@Component({selector: 'page-requests', templateUrl: 'requests.html'})
export class RequestsPage {

  SPRAYER_ADDRESS = "0xa5f1eea6d0a14c8e37cad8019f67b9ca19768f55" // CHANGE ME
  owner: { firstName?: string, lastName?: string } = {};F
  idCode: string;
  totalBalance: number;
  totalPending: number;
  enableRemoveButtonTime: number = Date.now() - 600000; // allow stop watching after 10min
  transfers: Transfer[] = [];
  pendingTransfers: Transfer[] = [];
  refreshing: boolean = false;
  sprayer: {dismissed : boolean, hasOutgoing : boolean, hasIncome : boolean} = { dismissed : false, hasOutgoing : false, hasIncome : false}; 

  constructor(public navCtrl: NavController,
              private toastCtrl: ToastController,
              public events: Events,
              public sdk: SdkService,
	      public push: Push,
	      public  plt: Platform,
              private alertCtrl: AlertController) {
    this.idCode = this.sdk.getEstonianIdCode();
    this.sprayer.dismissed = this.sdk.loadSprayerDismissed();
    this.loadData(null);
    this.sdk.nameFromIdAsync(this.idCode).then((nameJson) => {
      this.owner = nameJson;
    });
    events.subscribe('tx:newPending', () => this.refreshPending());



    // subscribe  to push notifications every time
    if (plt.is('cordova')) {
    	this.subscribeOnNotifications(this.sdk.addresses());
    }
  };

  private subscribeOnNotifications(addresses) {
  
         this.push.register().then((t: PushToken) => {
	      return this.push.saveToken(t);
	      }).then((t: PushToken) => {
	        this.sdk.registerToken(t.token, addresses);
		});

	this.push.rx.notification()
	  .subscribe((msg) => {
	  	let tx = new Transfer();
		tx = Object.assign(tx, msg.payload);
	  	let alertx = this.alertCtrl.create({ 
			title: msg.title,
			subTitle: msg.text,
			message: tx.ref.referenceText,
			buttons: ['OK']
			});
		alertx.present();
	      });
  
  }

  loadData(refresher) {
    this.refreshing = true;
    this.sdk.balanceTotalAsync().then((amount) => {
      this.totalBalance = amount;
    });
    this.refreshPending();

    this.transfers = [];
    this.sdk.transfersCleanedAsync().then((tx) => {
      if (tx) {
        this.transfers = tx.sort(function (a, b) {
          return a.timestamp - b.timestamp;
        }).reverse();
	this.refreshSprayer();
      }
      this.refreshing = false;
      if (refresher) {
        refresher.complete();
      }
    })
  }

  refreshSprayer() {
    if (!this.sprayer.dismissed) {
      // check if hasIncome
	if (this.transfers.filter( (tx) => 
		tx.sourceAccount.toLowerCase().indexOf(this.SPRAYER_ADDRESS.toLowerCase()) > -1
	).length) {
		this.sprayer.hasIncome = true;
	};
      // check if any outgoing tx
	if (this.transfers.filter( (tx) => 
		tx.signedAmount < 0
	).length) {
		this.sprayer.hasOutgoing = true;
	};
    }
  }

  getLongDate(tx: Transfer): string {
    return moment(tx.timestamp).format("LT ll");
  }

  getFormattedDate(tx: Transfer): string {
    return moment(tx.timestamp).fromNow();
  }

  toBankUpload() {
    this.navCtrl.push(TopupPage);
  }

  toSprayer() {
    this.navCtrl.push(SprayerPage);
  }

  sprayerDismiss() {
    this.sprayer.dismissed = true;
    this.sdk.saveSprayerDismissed();
  }

  toSendPage() {
    this.navCtrl.push(SendRequestPage);
  }

  sendRepeatRefund(tx : Transfer) {
  }

  ionViewCanEnter(): boolean {
    //blocks access if logged out
    return !!this.sdk.isUnlocked();
  }

  private refreshPending() {
    this.enableRemoveButtonTime = Date.now() - 600000;
    this.pendingTransfers = this.sdk.getPendingTransfers();
    this.totalPending = this.sdk.getPendingTotal();
    if (!this.pendingTransfers) {
      return
    }
    console.log("starting to refresh  pending for amount: ", this.totalPending);

    let pendingCheck = Observable.interval(10000).take(25);
    let checkAction = pendingCheck.subscribe(
      (x) => {
        if (this.pendingTransfers == null || this.pendingTransfers.length == 0) {
          checkAction.unsubscribe();
          pendingCheck = undefined;
        }
        console.log("Pending refresh TX try: ", x);
        this.pendingTransfers.map((pendingTx) => {
          pendingTx.pendingRefresh = true;
          this.sdk.transferStatusAsync(pendingTx.transactionHash).then((txCheckStatus: string) => {

            if (txCheckStatus != "PENDING") {
              this.sdk.removePendingTransfer(pendingTx.transactionHash);
              this.toastCtrl.create({message: 'Confirmed ' + pendingTx.transactionHash, duration: 5000});
              this.loadData(null);
            } else {
            }
            this.pendingTransfers = this.sdk.getPendingTransfers();
            this.totalPending = this.sdk.getPendingTotal();
            setTimeout(() => {
              pendingTx.pendingRefresh = false;
            }, 500);
          });
        });
      });
  };

  removePending(txhash: string): void {
    this.sdk.removePendingTransfer(txhash);
    this.refreshPending();
  }

  testit() {
    var arr = [{amount: 32, transactionHash: '0x223'}, {amount: 33, transactionHash: '0x444'}];
    this.sdk.escrowToPending(arr);
    this.refreshPending()

  }
}
