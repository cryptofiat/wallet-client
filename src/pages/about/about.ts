import { Component } from '@angular/core';
import { SdkService } from "../../services/sdk-service";
import { ContractInfoResponse } from '../../providers/response-data';

@Component({ selector: 'page-about', templateUrl: 'about.html' })
export class AboutPage {

  contractInfo : ContractInfoResponse = new ContractInfoResponse();
  totalSupply : number;

  constructor(private sdk: SdkService) {
    this.sdk.contractInfo().then( (res : ContractInfoResponse) => {
      this.contractInfo = res;
      this.sdk.totalSupplyEtherscan(this.contractInfo.reserveBank).then( (supply : number) => {
        this.totalSupply = supply;
      });
    });
  }

}
