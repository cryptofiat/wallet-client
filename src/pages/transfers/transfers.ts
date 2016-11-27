import { Component, ViewChild } from '@angular/core';

import { AlertController, App, List, ModalController, NavController } from 'ionic-angular';

/*
  To learn how to use third party libs in an
  Ionic app check out our docs here: http://ionicframework.com/docs/v2/resources/third-party-libs/
*/
import moment from 'moment';

import { UserData } from '../../providers/user-data';


@Component({
  selector: 'page-transfers',
  templateUrl: 'transfers.html'
})
export class TransfersPage {
  // the list is a child of the schedule page
  // @ViewChild('scheduleList') gets a reference to the list
  // with the variable #scheduleList, `read: List` tells it to return
  // the List and not a reference to the element
  @ViewChild('scheduleList', { read: List }) scheduleList: List;

  dayIndex = 0;
  queryText = '';
  segment = 'all';
  excludeTracks = [];
  shownSessions: any = [];
  groups = [];
  confDate: string;

  constructor(
    public alertCtrl: AlertController,
    public app: App,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public user: UserData
  ) {

  }

  ionViewDidLoad() {
    this.app.setTitle('Schedule');
    this.updateSchedule();
  }

  updateSchedule() {

  }

  presentFilter() {

  }

  goToSessionDetail(sessionData) {

  }


}
