import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { TransfersPage } from '../transfers/transfers';
import { AboutPage } from '../about/about';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any = TransfersPage;
  tab2Root: any = AboutPage;
  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }
}
