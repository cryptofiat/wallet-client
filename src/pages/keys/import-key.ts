import { Component } from '@angular/core';
import { SdkService } from "../../services/sdk-service";
import { NavController, ToastController } from 'ionic-angular';

@Component({ selector: 'page-import-key', templateUrl: 'import-key.html' })
export class ImportKeyPage {

  privKey  : string;
  newaddr  : string;
  wrongpwd : boolean = false;
  password : string;
  
  constructor(
      private navCtrl: NavController,
      private toastCtrl: ToastController,
      private sdk: SdkService
  ) {

  }

  importKey() {
    if (this.password && this.sdk.unlock(this.password)) {
        this.newaddr = '0x'+this.sdk.pubToAddress(this.sdk.storeNewKey(this.privKey));
	let toast = this.toastCtrl.create({message: 'Key added with address: '+this.newaddr,duration:3000});
	toast.present();
        this.navCtrl.pop();
    } else {
        this.wrongpwd = true;
    }

  }
}
