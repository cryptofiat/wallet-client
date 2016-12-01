import {Component, ViewChild} from '@angular/core';

import {Events, MenuController, Nav, Platform} from 'ionic-angular';
import {Splashscreen, StatusBar} from 'ionic-native';

import {LoginPage} from '../pages/login/login';
import {SignupPage} from '../pages/signup/signup';
import {TransfersPage} from '../pages/transfers/transfers';
import {LoggedInPage} from '../pages/loggedin/loggedin';

import {SdkService} from '../services/sdk-service';
import {UserData} from '../providers/user-data';
import {KeysPage} from "../pages/keys/keys";
import {AboutPage} from "../pages/about/about";
import {TopupPage} from "../pages/topup/topup";
import {TutorialPage} from '../pages/tutorial/tutorial';


@Component({
  templateUrl: 'app.template.html'
})
export class CryptofiatWallet {
  @ViewChild(Nav) nav: Nav;

  private howToPages = [
    {title: 'Tutorial', component: TutorialPage, icon: 'hammer'},
    {title: 'Add from bank', component: TopupPage, icon: 'add-circle'},
    {title: 'About', component: AboutPage, icon: 'information-circle'},
  ];

  //TODO: wish there was a way to use enum here
  //enum LoginState { PRE_INIT, IN, OUT };
  //public loginState : LoginState = LoginState.PRE_INIT;


  public loginState : string = "PRE_INIT";

  private rootPage: any;

  constructor(events: Events, private userData: UserData, private menu: MenuController, platform: Platform, private sdk : SdkService) {

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
  }

  private navigateToInitialPage() {

    this.userData.hasInitialized().then(hasInitialized => {
      return hasInitialized ?
        this.userData.hasLoggedIn().then(hasLoggedIn => hasLoggedIn ? TransfersPage : SignupPage) :
        this.userData.checkHasSeenTutorial().then(hasSeenTutorial => hasSeenTutorial ? SignupPage : TutorialPage);
    }).then(page => {
      this.rootPage = page;
      //this.enableMenu(page == LoggedInPage);
      this.refreshMenu();
    })

  }

  private refreshMenu() {
    this.loginState = this.sdk.initiated() ?  (this.sdk.isUnlocked()) ? "IN" : "OUT" : "PRE_INIT";
    console.log('state of login: ',this.loginState);
    this.menu.enable(true, 'loggedOutMenu');
    //this.menu.enable(!loggedIn, 'loggedOutMenu');
  }

  public pushPage(page) {
    this.nav.push(page);
  }

  public openKeys() {
    this.nav.setRoot(KeysPage);
  }

  public openSignUp() {
    this.nav.setRoot(SignupPage);
  }

  public openTransfers() {
    this.nav.setRoot(TransfersPage);
  }

  public logout() {
    this.sdk.logout();
    this.loginState = "OUT";
    this.nav.setRoot(SignupPage);
  }
}
