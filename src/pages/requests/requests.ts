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
  idCode: string;
  enableRemoveButtonTime: number = Date.now() - 600000; // allow stop watching after 10min
  requests: Transfer[] = []; // change to Request[]
  refreshing: boolean = false;

  constructor(public navCtrl: NavController,
              private toastCtrl: ToastController,
              public events: Events,
              public sdk: SdkService,
	            public push: Push,
	            public  plt: Platform,
              private alertCtrl: AlertController) {
    this.idCode = this.sdk.getEstonianIdCode();
    this.loadData(null);

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

    this.requests = [];
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

  toSendPage() {
    this.navCtrl.push(SendRequestPage);
  }

  sendRepeatRefund(tx : Transfer) {
  }

  ionViewCanEnter(): boolean {
    //blocks access if logged out
    return !!this.sdk.isUnlocked();
  }

}
