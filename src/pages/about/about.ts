import { Component } from '@angular/core';
import { SdkService } from "../../services/sdk-service";

@Component({ selector: 'page-about', templateUrl: 'about.html' })
export class AboutPage {
  //private sdk : SdkService;

  constructor(private sdk: SdkService) {
  //  this.sdk = new SdkService();
  }

  testSdk() {
    this.sdk.initLocalStorage('12345');
    console.log('is unlocked: ' + this.sdk.isUnlocked());
  }
}
