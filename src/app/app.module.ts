import { NgModule } from '@angular/core';

import { IonicApp, IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { CryptofiatWallet } from './app.component';

import { AboutPage } from '../pages/about/about';
import { LoginPage } from '../pages/login/login';
import { TransfersPage } from '../pages/transfers/transfers';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import { TopupPage } from '../pages/topup/topup';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { VerifyPage } from '../pages/verify/verify';

import { UserData } from '../providers/user-data';
import { SdkService } from '../services/sdk-service.ts';


@NgModule({
  declarations: [
    CryptofiatWallet,
    AboutPage,
    LoginPage,
    TransfersPage,
    SignupPage,
    TabsPage,
    TutorialPage,
    VerifyPage,
    TopupPage
  ],
  imports: [
    IonicModule.forRoot(CryptofiatWallet)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    CryptofiatWallet,
    AboutPage,
    LoginPage,
    TransfersPage,
    SignupPage,
    TabsPage,
    TutorialPage,
    VerifyPage,
    TopupPage
  ],
  providers: [UserData, Storage, SdkService]
})
export class AppModule { }
