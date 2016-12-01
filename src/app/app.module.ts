import { NgModule } from '@angular/core';

import { IonicApp, IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { CryptofiatWallet } from './app.component';

import { AboutPage } from '../pages/about/about';
import { TransfersPage } from '../pages/transfers/transfers';
import { SendPage } from '../pages/send/send';
import { SignupPage } from '../pages/signup/signup';
import { LoggedInPage } from '../pages/loggedin/loggedin';
import { TopupPage } from '../pages/topup/topup';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { VerifyPage } from '../pages/verify/verify';
import { KeysPage,ImportKeyPage } from '../pages/keys/keys';

import { UserData } from '../providers/user-data';
import { Transfer, TransferReference } from '../providers/transfer-data';
import { SdkService } from '../services/sdk-service.ts';


@NgModule({
  declarations: [
    CryptofiatWallet,
    AboutPage,
    TransfersPage,
    SignupPage,
    LoggedInPage,
    TutorialPage,
    VerifyPage,
    SendPage,
    KeysPage,
    ImportKeyPage,
    TopupPage
  ],
  imports: [
    IonicModule.forRoot(CryptofiatWallet)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    CryptofiatWallet,
    AboutPage,
    TransfersPage,
    SignupPage,
    LoggedInPage,
    TutorialPage,
    VerifyPage,
    SendPage,
    KeysPage,
    ImportKeyPage,
    TopupPage
  ],
  providers: [UserData, Storage, SdkService, Transfer, TransferReference]
})
export class AppModule { }
