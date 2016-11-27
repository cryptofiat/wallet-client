import { NgModule } from '@angular/core';

import { IonicApp, IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { CryptofiatWallet } from './app.component';

import { AboutPage } from '../pages/about/about';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { TransfersPage } from '../pages/transfers/transfers';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import { TopupPage } from '../pages/topup/topup';
import { TutorialPage } from '../pages/tutorial/tutorial';

import { ConferenceData } from '../providers/conference-data';
import { UserData } from '../providers/user-data';


@NgModule({
  declarations: [
    CryptofiatWallet,
    AboutPage,
    AccountPage,
    LoginPage,
    TransfersPage,
    SignupPage,
    TabsPage,
    TutorialPage,
    TopupPage
  ],
  imports: [
    IonicModule.forRoot(CryptofiatWallet)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    CryptofiatWallet,
    AboutPage,
    AccountPage,
    LoginPage,
    TransfersPage,
    SignupPage,
    TabsPage,
    TutorialPage,
    TopupPage
  ],
  providers: [ConferenceData, UserData, Storage]
})
export class AppModule { }
