import {Injectable} from '@angular/core';

@Injectable()
export class SendResponse {

  public id : string;
  public fromAddress : string;
  public toAddress : string;

  constructor() {}

}

export class LdapResponse {

  public idCode : string;
  public firstName : string;
  public lastName : string;

  constructor() {}

}

export class ContractInfoResponse{
  accountApproving: string;
  accountRecovery: string;
  accounts: string;
  base: string;
  data: string;
  delegation: string;
  enforcement: string;
  reserveBank: string;

  constructor() {}
}

export class CommonError{
  message: string;
  error: string;
  exception: string;
  path: string;
  status: number;
  timestamp: number;

  constructor() {}
}
