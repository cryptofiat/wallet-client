import { Component } from '@angular/core';
import { SdkService } from "../../services/sdk-service";
import { VerifyPage } from "../verify/verify";
import { SyncPage } from "../sync/sync";
import { ImportKeyPage } from "./import-key";
import { NavController, ToastController } from 'ionic-angular';

@Component({ selector: 'page-keys', templateUrl: 'keys.html' })
export class KeysPage {

  addresses : {
     address? : string,
     balance? : number,
     privKeyHex? : string;
     approved? : boolean,
     showKey? : boolean,
  }[] = [];
  
  constructor(
      private navCtrl: NavController,
      private sdk: SdkService
  ) {
      this.refreshKeys(null);
  }

  refreshKeys(refresher) {

      this.sdk.contractDataAsync().then( (response) => {
	  this.addresses = response;
	  if (refresher) { refresher.complete(); }
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

