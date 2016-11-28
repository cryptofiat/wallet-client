import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { SdkService } from '../../services/sdk-service';
import { Transfer, TransferReference } from '../../providers/transfer-data';

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
  transfers : Transfer[] = [];
  refreshing : boolean = false;

  constructor(
    public navCtrl: NavController,
    public sdk: SdkService
  ) {
        this.idCode = this.sdk.getEstonianIdCode();
        this.loadData()

  }

  refreshClick() {
            this.loadData()
  };

  loadData() {
        this.refreshing = true;
        this.sdk.balanceTotalAsync().then((amount) => {
            this.totalBalance = amount;
        });

        this.sdk.transfersCleanedAsync().then((tx) => {
	    if (tx) {
                this.transfers = tx.sort(function(a,b) { return a.timestamp-b.timestamp; } ).reverse();
            }
            this.refreshing = false;
        })
  }

  getFormattedDate(tx : Transfer) : string {
        return moment(tx.timestamp).fromNow();
  }
}
