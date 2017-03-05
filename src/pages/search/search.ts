import {Component, ViewChild} from '@angular/core';
import { Searchbar, Events, NavParams, NavController } from 'ionic-angular';
import { SdkService } from "../../services/sdk-service";
import moment from 'moment';

class Recipient {
  idCode : string; 
  firstName : string; 
  lastName : string;
}

@Component({ selector: 'page-search', templateUrl: 'search.html' })
export class RecipientSearchPage {

  @ViewChild('searchbar') searchbar:Searchbar;

  private searchInput : string = "";
  recentRecipients : Recipient[] = [];
  results : Recipient[] = [];
  searching : boolean = false;
  callback : any;


  constructor(
     private sdk: SdkService, 
     private navCtrl: NavController, 
     private navParams: NavParams, 
     private events: Events
  ) {
    this.loadRecent();
  }

  getFromNow(timestamp : number) : string {
    return moment(timestamp).fromNow();
  }

  loadRecent() {
    this.recentRecipients = this.sdk.getRecentRecipients();
  }

  getItems(ev : any) {
    this.results = [];
    if (this.searchInput.length > 2) {
      this.searching = true;
      this.sdk.searchLdapAsync(this.searchInput).then( (response: Array<Recipient>) => {
        this.results = response;
        this.searching = false;
      });
    }
  }

  ionViewWillEnter() {
    this.callback = this.navParams.get("callback");
  }

  ionViewDidLoad() {
    setTimeout( () => {
      this.searchbar.setFocus();
    }, 500);
  }

  returnIdCode(idCode : string) {
    this.callback(idCode).then( () => {
      this.navCtrl.pop();
    });
  }
}
