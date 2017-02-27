import {Component} from '@angular/core';
import { Events, NavParams, NavController } from 'ionic-angular';
import { SdkService } from "../../services/sdk-service";

class Recipient {
  idCode : string; 
  firstName : string; 
  lastName : string;
}

@Component({ selector: 'page-search', templateUrl: 'search.html' })
export class RecipientSearchPage {

  private searchInput : string = "";
  recentRecipients : Recipient[] = [];
  results : Recipient[] = [];
  callback : any;

  constructor(
     private sdk: SdkService, 
     private navCtrl: NavController, 
     private navParams: NavParams, 
     private events: Events
  ) {
    this.loadRecent();
  }

  loadRecent() {
    this.sdk.nameFromIdAsync(38008030265).then( (json : Recipient) => {
      this.recentRecipients.push(json)
    });
  }

  getItems(ev : any) {
  //  this.loadRecent();
  }

  ionViewWillEnter() {
    this.callback = this.navParams.get("callback");
  }

  returnIdCode(idCode : string) {
    this.callback(idCode).then( () => {
      this.navCtrl.pop();
    });
  }
}
