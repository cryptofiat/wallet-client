import { Injectable } from '@angular/core';

@Injectable()
export class InitialActionService {
  public requestedAction;

  constructor() {
    this.requestedAction = this.getActionFromURI();
  }

  private getPayment(query): any {
    const result = {};
    query.split("&").forEach(function(part) {
      const item = part.split("=");
      result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
  }

  private getActionFromURI() {
    if(!window.location.hash) return null;
    const uri = window.location.hash.split('/');
    if(uri.length < 3) return null;
    const id = uri[1];
    const parsedUrl = uri[2].split('?');
    if(parsedUrl.length < 2) return null;
    const query = this.getPayment(parsedUrl[1]);
    query.idCode = id;
    const action = parsedUrl[0];
    return {
      action,
      query
    }
  }
}