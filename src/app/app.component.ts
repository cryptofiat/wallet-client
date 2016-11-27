import {Component, ViewChild} from '@angular/core';

import {Events, MenuController, Nav, Platform} from 'ionic-angular';
import {Splashscreen, StatusBar} from 'ionic-native';
import {Storage} from '@ionic/storage';

import {AccountPage} from '../pages/account/account';
import {LoginPage} from '../pages/login/login';
import {SignupPage} from '../pages/signup/signup';
import {TabsPage} from '../pages/tabs/tabs';
import {TutorialPage} from '../pages/tutorial/tutorial';
import {SupportPage} from '../pages/support/support';

import {ConferenceData} from '../providers/conference-data';
import {UserData} from '../providers/user-data';

export interface PageInterface {
  title: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
}

@Component({
  templateUrl: 'app.template.html'
})
export class CryptofiatWallet {
  @ViewChild(Nav) nav: Nav;

  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  appPages: PageInterface[] = [
    {title: 'Schedule', component: TabsPage, icon: 'calendar'},
    {title: 'Speakers', component: TabsPage, index: 1, icon: 'contacts'},
    {title: 'Map', component: TabsPage, index: 2, icon: 'map'},
    {title: 'About', component: TabsPage, index: 3, icon: 'information-circle'}
  ];
  loggedInPages: PageInterface[] = [
    {title: 'Account', component: AccountPage, icon: 'person'},
    {title: 'Support', component: SupportPage, icon: 'help'},
    {title: 'Logout', component: TabsPage, icon: 'log-out', logsOut: true}
  ];
  loggedOutPages: PageInterface[] = [
    {title: 'Login', component: LoginPage, icon: 'log-in'},
    {title: 'Support', component: SupportPage, icon: 'help'},
    {title: 'Signup', component: SignupPage, icon: 'person-add'}
  ];
  rootPage: any;

  constructor(public events: Events,
              public userData: UserData,
              public menu: MenuController,
              public platform: Platform,
              public confData: ConferenceData,
              public storage: Storage) {

    platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });

    this.userData.checkHasSeenTutorial().then((hasSeenTutorial) => this.rootPage = hasSeenTutorial ? TabsPage : TutorialPage);

    confData.load();

    this.userData.hasLoggedIn().then(this.enableMenu);

    this.listenToLoginEvents();
  }

  openPage(page: PageInterface) {
    // the nav component was found using @ViewChild(Nav)
    // reset the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index) {
      this.nav.setRoot(page.component, {tabIndex: page.index});
    } else {
      this.nav.setRoot(page.component).catch(() => {
        console.log("Didn't set nav root");
      });
    }

    page.logsOut && setTimeout(this.userData.logout.bind(this.userData), 1000);
  }

  openTutorial() {
    this.nav.setRoot(TutorialPage);
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => this.enableMenu(true));
    this.events.subscribe('user:signup', () =>  this.enableMenu(true));
    this.events.subscribe('user:logout', () => this.enableMenu(false));
  }

  enableMenu(loggedIn) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }
}