import { Component } from '@angular/core';
import { SdkService } from "../../services/sdk-service";

@Component({ selector: 'page-sync', templateUrl: 'sync.html' })
export class SyncPage {
  syncParams: {password?: string, idCode?: string, passwordConfirm?: string, createLocal? :boolean} = {createLocal:true};
  fullName : { firstName?: string, lastName? : string} = {};
  idCodeCheck : string;
  syncStatus : string = "";
  createLocalStatus : boolean = false;
  errorMsg : string = "";
  //loginStatus : string = "";
  syncLog : {downloaded_addresses : Array<string>, uploaded_addresses : Array<string>} = {downloaded_addresses:[],uploaded_addresses:[]};

  constructor(private sdk: SdkService) {
    if (this.sdk.getEstonianIdCode().length == 11) {
      this.syncParams.idCode = this.sdk.getEstonianIdCode();
    }
    if (this.sdk.getSecret()) {
      this.syncParams.password = this.sdk.getSecret();
    }
    this.idCodeChecker();
  }

  isPasswordSet() : Boolean {
      return this.sdk.initiated();
  };

  startSync() {
    this.createLocalStatus = false;
    this.syncStatus = "progress";
    if (this.sdk.getEstonianIdCode().length == 11 && this.syncParams.idCode != this.sdk.getEstonianIdCode()) {
	    this.syncStatus = "failure";
	    this.errorMsg = "Device already set up with another ID";
	    return false;
    }
    this.sdk.hasBackup(this.syncParams.idCode).then( (hasbackup) => {
	if (!hasbackup) {
		if (this.syncParams.password != this.syncParams.passwordConfirm) {
		    this.syncStatus = "failure";
		    this.errorMsg = "Passwords don't match";
		    return false;
		}
		return this.sdk.backupInit(this.syncParams.password, this.syncParams.idCode);
	} else {
		return this.sdk.backupVerifyPassword(this.syncParams.password, this.syncParams.idCode).then( (success) => {
			if (!success) {
			    this.syncStatus = "failure";
			    this.errorMsg = "Wrong password";
			}
			return success;
		});
	}
    }).then( (ready) => {
	if (ready) {
		if (!this.sdk.initiated() && this.syncParams.createLocal) {
			//initialise local storage
			this.sdk.initLocalStorage(this.syncParams.password);
			this.sdk.unlock(this.syncParams.password);
			this.sdk.storeEstonianIdCode(this.syncParams.idCode);
			this.createLocalStatus = true;
		};
		if (!this.sdk.isUnlocked()) {
			this.syncStatus = "failure";
			this.errorMsg = "Device password not set.";
			return;
		}
		this.sdk.backupSyncAll(this.syncParams.password, this.syncParams.idCode).then( (retval) => {

			Object.assign(this.syncLog,retval);
    			this.syncStatus = "success";
		});
        }
    });

    //this.sdk.syncAllKeys(syncParams.password, syncParams.idCode).then( (retval) => {
    //});
  }

  

  testSdk() {
    this.sdk.initLocalStorage('12345');
    console.log('is unlocked: ' + this.sdk.isUnlocked());
  }

  /*TODO: this is common with the id component on SendPage */

  idCodeChecker() {
          if (!this.syncParams.idCode || this.syncParams.idCode.length != 11) {
             this.idCodeCheck="";
             return;
          }
          this.idCodeCheck = "loading";

          this.sdk.nameFromIdAsync(this.syncParams.idCode).then( (nameJson) => {
              	this.fullName = nameJson;
		if (nameJson && this.fullName.lastName) {
                  this.idCodeCheck = "yes"; 
		  this.sdk.hasBackup(this.syncParams.idCode).then( (res) => {
			this.idCodeCheck = (res) ? 'yes' : 'new';
		  });
                } else {
                  this.fullName = {};
                  this.idCodeCheck = "no" 
                }
          });

   }
}
