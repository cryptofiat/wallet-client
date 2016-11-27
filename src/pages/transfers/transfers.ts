import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { SdkService } from '../../services/sdk-service';

/*
  To learn how to use third party libs in an
  Ionic app check out our docs here: http://ionicframework.com/docs/v2/resources/third-party-libs/
*/
import moment from 'moment';

@Component({
  selector: 'page-transfers',
  templateUrl: 'transfers.html'
})
export class TransfersPage {

  idCode: string;
  totalBalance: number;
  transfers : {transactionHash?: string, ref?: any, signedAmount?: number}[] = [{transactionHash:"cba"},{transactionHash:"abc"}];

  constructor(
    public navCtrl: NavController,
    public sdk: SdkService
  ) {

  }

}
