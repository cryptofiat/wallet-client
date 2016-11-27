import {Component, ViewChild} from '@angular/core';

import {Events, MenuController, Nav, Platform} from 'ionic-angular';
import {Splashscreen, StatusBar} from 'ionic-native';
import {Storage} from '@ionic/storage';

import {AccountPage} from '../pages/account/account';
import {LoginPage} from '../pages/login/login';
import {SignupPage} from '../pages/signup/signup';
import {TabsPage} from '../pages/tabs/tabs';
import {TutorialPage} from '../pages/tutorial/tutorial';

import {ConferenceData} from '../providers/conference-data';
import {UserData} from '../providers/user-data';
import {AboutPage} from "../pages/about/about";
import {TopupPage} from "../pages/topup/topup";

@Component({
  templateUrl: 'app.template.html'
})
export class CryptofiatWallet {
  @ViewChild(Nav) nav: Nav;

  howToPages = [
    {title: 'Tutorial', component: TutorialPage, icon: 'hammer'},
    {title: 'Topup', component: TopupPage, icon: 'add-circle'},
    {title: 'About', component: AboutPage, icon: 'information-circle'},
  ];

  rootPage: any;

  constructor(public events: Events, public userData: UserData, public menu: MenuController, public platform: Platform,
              public confData: ConferenceData, public storage: Storage) {

    platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });

    this.navigateToInitialPage();
    this.listenToLoginEvents();
  }

  //TODO: refactor
  private navigateToInitialPage() {
    this.userData.hasLoggedIn().then((hasLoggedIn) => {
      if (hasLoggedIn) {
        this.rootPage = TabsPage;
      } else {
        this.userData.checkHasSeenTutorial().then((hasSeenTutorial) => this.rootPage = hasSeenTutorial ? SignupPage : TutorialPage);
      }
    });
  }

  openPage(page) {
    this.nav.setRoot(page);
  }

  openImportKey() {
  }

  openKeysManagement() {
  }

  openSignUp() {
    this.openPage(SignupPage);
  }

  logout() {
    this.userData.logout();
    this.openPage(LoginPage);
  }

  listenToLoginEvents() {
    this.userData.hasLoggedIn().then(this.enableMenu.bind(this));

    this.events.subscribe('user:login', () => this.enableMenu(true));
    this.events.subscribe('user:signup', () => this.enableMenu(true));
    this.events.subscribe('user:logout', () => this.enableMenu(false));
  }

  enableMenu(loggedIn) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }
}
