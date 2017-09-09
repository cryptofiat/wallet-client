import { Component } from '@angular/core';

import { Events, MenuController, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import {SignupPage} from "../signup/signup";
import {TransfersPage} from '../transfers/transfers';


export interface Slide {
  title: string;
  description: string;
  image: string;
}

@Component({ selector: 'page-tutorial', templateUrl: 'tutorial.html' })
export class TutorialPage {
  slides: Slide[];
  showSkip = true;

  constructor(public navCtrl: NavController, public menu: MenuController, public storage: Storage) {
    this.slides = [
      {
        title: 'Welcome to <b>EURO 2.0</b>',
        description: 'The <b>Wallet App</b> is a practical preview of the Estonian Euro 2.0 Infrastructure in action.',
        image: 'assets/img/ica-slidebox-img-1.png',
      },
      {
        title: 'What is Euro 2.0?',
        description: '<b>Euro 2.0 infrastructure</b> is an Ethereum blockchain based autonomous monetary system, where everyone can hold and move Euros without intermediators or central party.',
        image: 'assets/img/ica-slidebox-img-2.png',
      },
      {
        title: 'How can I use it?',
        description: 'You can join <b>EURO 2.0</b> with Estonian digital ID and you can send money to anyone who holds an Estonian ID code (isikukood).',
        image: 'assets/img/ica-slidebox-img-3.png',
      }
    ];
  }

  startApp() {
    this.storage.set('hasSeenTutorial', 'false');
    this.navCtrl.popToRoot();
  }

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd;
  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }

}
