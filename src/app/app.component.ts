import {Component, ViewChild} from '@angular/core';

import {Events, MenuController, Nav, Platform} from 'ionic-angular';
import {Splashscreen, StatusBar} from 'ionic-native';

//import {AccountPage} from '../pages/account/account';
import {LoginPage} from '../pages/login/login';
import {SignupPage} from '../pages/signup/signup';
import {TabsPage} from '../pages/tabs/tabs';
import {TutorialPage} from '../pages/tutorial/tutorial';

import {UserData} from '../providers/user-data';
import {AboutPage} from "../pages/about/about";
import {TopupPage} from "../pages/topup/topup";

@Component({
  templateUrl: 'app.template.html'
})
export class CryptofiatWallet {
  @ViewChild(Nav) nav: Nav;

  private howToPages = [
    {title: 'Tutorial', component: TutorialPage, icon: 'hammer'},
    {title: 'Topup', component: TopupPage, icon: 'add-circle'},
    {title: 'About', component: AboutPage, icon: 'information-circle'},
  ];

  private rootPage: any;

  constructor(private events: Events, private userData: UserData, private menu: MenuController, private platform: Platform) {

    platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });

    this.navigateToInitialPage();
    this.listenToLoginEvents();
  }

  private navigateToInitialPage() {
    this.userData.hasInitialized().then(hasLoggedIn => {
      return hasLoggedIn ?
        this.userData.hasLoggedIn().then(hasLoggedIn => hasLoggedIn ? TabsPage : LoginPage) :
        this.userData.checkHasSeenTutorial().then(hasSeenTutorial => hasSeenTutorial ? SignupPage : TutorialPage);
    }).then(page => this.rootPage = page)
  }

  private listenToLoginEvents() {
    this.userData.hasInitialized().then(this.enableMenu.bind(this));

    this.events.subscribe('user:login', () => this.enableMenu(true));
    this.events.subscribe('user:signup', () => this.enableMenu(true));
    this.events.subscribe('user:logout', () => this.enableMenu(false));
  }

  private enableMenu(loggedIn) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }

  public pushPage(page) {
    this.nav.push(page);
  }

  public openImportKey() {
  }

  public openKeysManagement() {
  }

  public openSignUp() {
    this.nav.setRoot(SignupPage);
  }

  public logout() {
    this.userData.logout();
    this.nav.setRoot(LoginPage);
  }
}
