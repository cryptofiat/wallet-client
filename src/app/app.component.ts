import {Component, ViewChild} from '@angular/core';

import {Events, MenuController, Nav, Platform} from 'ionic-angular';
import {Splashscreen, StatusBar} from 'ionic-native';

import {LoginPage} from '../pages/login/login';
import {SignupPage} from '../pages/signup/signup';
import {LoggedInPage} from '../pages/loggedin/loggedin';

import {UserData} from '../providers/user-data';
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
    {title: 'Topup', component: TopupPage, icon: 'add-circle'},
    {title: 'About', component: AboutPage, icon: 'information-circle'},
  ];

  private rootPage: any;

  constructor(events: Events, private userData: UserData, private menu: MenuController, platform: Platform) {

    platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });

    events.subscribe('invalidateRoot', this.navigateToInitialPage);
    this.navigateToInitialPage();
  }

  private navigateToInitialPage() {

    this.userData.hasInitialized().then(hasInitialized => {
      return hasInitialized ?
        this.userData.hasLoggedIn().then(hasLoggedIn => hasLoggedIn ? LoggedInPage : LoginPage) :
        this.userData.checkHasSeenTutorial().then(hasSeenTutorial => hasSeenTutorial ? SignupPage : TutorialPage);
    }).then(page => {
      this.rootPage = page;
      this.enableMenu(page == LoggedInPage);
    })
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
