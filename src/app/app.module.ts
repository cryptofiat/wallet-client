import { NgModule } from '@angular/core';

import { IonicApp, IonicModule } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { IonicStorageModule } from '@ionic/storage';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

import { CryptofiatWallet } from './app.component';

import { AboutPage } from '../pages/about/about';
import { TransfersPage } from '../pages/transfers/transfers';
import { SendPage } from '../pages/send/send';
import { SignupPage } from '../pages/signup/signup';
import { TopupPage } from '../pages/topup/topup';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { VerifyPage } from '../pages/verify/verify';
import { SyncPage } from '../pages/sync/sync';
import { SprayerPage } from '../pages/sprayer/sprayer';
import { KeysPage } from '../pages/keys/keys';
import { ImportKeyPage } from '../pages/keys/import-key';
import { RecipientSearchPage } from "../pages/search/search";
import { RequestsPage } from "../pages/requests/requests";
import { SendRequestPage } from '../pages/sendrequest/sendrequest';

import { UserData } from '../providers/user-data';
import { Transfer, TransferReference } from '../providers/transfer-data';
import { SdkService } from '../services/sdk-service.ts';

import { QRCodeModule } from 'angular2-qrcode';
import { Deeplinks } from '@ionic-native/deeplinks';

const cloudSettings: CloudSettings = {
	'core': {
		'app_id': 'a5f0f656'
	},
	'push': {
		'sender_id': '431246304717',
		'pluginConfig': {
			'ios': {
				'badge': true,
				'sound': true
			},
			'android': {
				'iconColor': '#343434'
			}
		}
	}

};

@NgModule({
  declarations: [
    CryptofiatWallet,
    AboutPage,
    TransfersPage,
    SignupPage,
    TutorialPage,
    VerifyPage,
    SendPage,
    KeysPage,
    SyncPage,
    RecipientSearchPage,
    SprayerPage,
    ImportKeyPage,
    TopupPage,
    RequestsPage,
    SendRequestPage
  ],
  imports: [
    BrowserModule,
    QRCodeModule,
    IonicModule.forRoot(CryptofiatWallet, {
    	  // 'path'  doesn't work on ionic serve
	  locationStrategy: 'hash'
	}, {
	links: [
	  {component: AboutPage, name: 'About', segment: 'about' },
	  {component: SendPage, name: 'Send', segment: ':idCode/payment/:amount/:referenceText' }
	]
    }),
    IonicStorageModule.forRoot(),
    CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    CryptofiatWallet,
    AboutPage,
    TransfersPage,
    SignupPage,
    TutorialPage,
    VerifyPage,
    SendPage,
    RecipientSearchPage,
    KeysPage,
    SyncPage,
    SprayerPage,
    ImportKeyPage,
    TopupPage,
    RequestsPage,
    SendRequestPage
  ],
  providers: [
  	UserData, 
	SdkService, 
	Transfer, 
    	Deeplinks,
	TransferReference 
	]
})
export class AppModule { }
