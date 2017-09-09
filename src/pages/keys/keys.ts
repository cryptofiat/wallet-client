import { Component } from '@angular/core';
import { SdkService } from "../../services/sdk-service";
import { VerifyPage } from "../verify/verify";
import { SyncPage } from "../sync/sync";
import { ImportKeyPage } from "./import-key";
import { NavController, ToastController, LoadingController } from 'ionic-angular';

@Component({ selector: 'page-keys', templateUrl: 'keys.html' })
export class KeysPage {
  loader: any;
  addresses : {
     address? : string,
     balance? : number,
     privKeyHex? : string;
     approved? : boolean,
     showKey? : boolean,
  }[] = [];
  
  constructor(
      private navCtrl: NavController,
      private sdk: SdkService,
      private loadingCtrl: LoadingController,
  ) {

      this.refreshKeys(null);
  }

  ionViewDidLoad () {
    this.loader = this.loadingCtrl.create({
      content: 'Loading keys...',
    });
    this.loader.present();
  }

  refreshKeys(refresher) {
    this.sdk.contractDataAsync().then( (response) => {
      this.addresses = response;
      refresher ? refresher.complete() : this.loader.dismiss()
     
     })

  }

  removeKey(privKeyHex : string) {
      this.sdk.removeKey(privKeyHex);
      this.refreshKeys(null);
  }

  verify(privKey : string) {
      this.navCtrl.push(VerifyPage, {privKey:privKey});
  }


  generateNewKey() {
      this.navCtrl.push(VerifyPage);
  }

  showImportKey() {
      this.navCtrl.push(ImportKeyPage);
  }

  syncKey() {
      this.navCtrl.push(SyncPage);

  }
}

