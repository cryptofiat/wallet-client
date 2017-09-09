import {Component} from '@angular/core';
import { SdkService } from '../../services/sdk-service';

@Component({ selector: 'page-sprayer', templateUrl: 'sprayer.html' })
export class SprayerPage {
  idCode: string;
  constructor(
    public sdk: SdkService
  ) {
        this.idCode = this.sdk.getEstonianIdCode();
  }

  requestSpray() {
	// send request, when TxHash is returned  then register pending transfer  and return to transfers screen
  this.sdk.spray(this.idCode)
  }

}
