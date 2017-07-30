import { NgModule } from '@angular/core';

import { IonicApp, IonicModule } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { IonicStorageModule } from '@ionic/storage';

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
import { KeysPage,ImportKeyPage } from '../pages/keys/keys';
import { RecipientSearchPage } from "../pages/search/search";

import { UserData } from '../providers/user-data';
import { Transfer, TransferReference } from '../providers/transfer-data';
import { SdkService } from '../services/sdk-service.ts';


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
    TopupPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(CryptofiatWallet),
    IonicStorageModule.forRoot()
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
    TopupPage
  ],
  providers: [UserData, SdkService, Transfer, TransferReference]
})
export class AppModule { }
