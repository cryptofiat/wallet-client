import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { TransfersPage } from '../transfers/transfers';
import { SpeakerListPage } from '../speaker-list/speaker-list';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any = TransfersPage;
  tab2Root: any = SpeakerListPage;
  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }
}
