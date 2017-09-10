import {Component, ViewChild, HostListener} from '@angular/core';

import {Events, MenuController, Nav, Platform, ToastController} from 'ionic-angular';
import {Splashscreen, StatusBar} from 'ionic-native';

import {SignupPage} from '../pages/signup/signup';
import {SendPage} from '../pages/send/send';
import {TransfersPage} from '../pages/transfers/transfers';

import {SdkService} from '../services/sdk-service';
import {UserData} from '../providers/user-data';
import {KeysPage} from "../pages/keys/keys";
import {AboutPage} from "../pages/about/about";
import {TopupPage} from "../pages/topup/topup";
import {TutorialPage} from '../pages/tutorial/tutorial';
import {RequestsPage} from '../pages/requests/requests';
import {SendRequestPage} from '../pages/sendrequest/sendrequest';


@Component({
  templateUrl: 'app.template.html'
})

export class CryptofiatWallet {
  @ViewChild(Nav) nav: Nav;

  public howToPages = [
    {title: 'Tutorial', component: TutorialPage, icon: 'hammer'},
    {title: 'About', component: AboutPage, icon: 'information-circle'},
  ];

  //TODO: wish there was a way to use enum here
  //enum LoginState { PRE_INIT, IN, OUT };
  //public loginState : LoginState = LoginState.PRE_INIT;


  public loginState: string = "PRE_INIT";

  public rootPage: any;

  owner: { firstName?: string, lastName?: string } = {};
  idCode: string;

  public toast: any;

  constructor(
    events: Events,
    private userData: UserData,
    private menu: MenuController,
    platform: Platform,
    private sdk: SdkService,
    public toastCtrl: ToastController
   ) {

    platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });

    events.subscribe('invalidateRoot', this.navigateToInitialPage);
    events.subscribe('user:login', () => {
      this.refreshMenu();
    });
    events.subscribe('user:initiate', () => {
      this.refreshMenu();
    });

    this.navigateToInitialPage();
    //this.rootPage = TutorialPage;



  }

  private navigateToInitialPage() {

    this.userData.hasInitialized().then(hasInitialized => {
      let page : any;
      page = ( hasInitialized ) ?
        this.userData.hasLoggedIn().then(hasLoggedIn => hasLoggedIn ? TransfersPage : SignupPage) :
        this.userData.checkHasSeenTutorial().then(hasSeenTutorial => hasSeenTutorial ? SignupPage : TutorialPage);
      //this.enableMenu(page == LoggedInPage);
      return page;
      }).then( (page) => {
		this.rootPage=page;
		this.refreshMenu();
        });
  }

  private refreshMenu() {
    this.idCode = this.sdk.getEstonianIdCode();

    this.sdk.nameFromIdAsync(this.idCode).then((nameJson) => {
      this.owner = nameJson;
    });

    this.loginState = this.sdk.initiated() ? (this.sdk.isUnlocked()) ? "IN" : "OUT" : "PRE_INIT";
    this.menu.enable(true, 'loggedOutMenu');
    //this.menu.enable(!loggedIn, 'loggedOutMenu');
  }

  public pushPage(page) {
    this.nav.push(page);
  }

  public pushTopupPage() {
    this.nav.setRoot(TopupPage);
  }

  public openKeys() {
    this.nav.setRoot(KeysPage);
  }

  public openRequests() {
    this.nav.setRoot(RequestsPage);
  } 

  public openRequest() {
    this.nav.push(SendRequestPage);
  } 

  public openSignUp() {
    this.nav.setRoot(SignupPage);
  }

  public openSend() {
    this.nav.push(SendPage);
  }

  public openTransfers() {
    this.nav.setRoot(TransfersPage);
  }

  @HostListener('window:offline')
  public offlineMode(e): void {
     this.toast = this.toastCtrl.create({
      message: 'Internet connection not found',
      position: 'bottom'
    });
    this.toast.present();
  }

  @HostListener('window:online')
  public goingBackOnline(e): void {
     if(this.toast) this.toast.dismiss();
  }

  public logout() {
    this.sdk.logout();
    this.loginState = "OUT";
    this.nav.setRoot(SignupPage);
  }
}
