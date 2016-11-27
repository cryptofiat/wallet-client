import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';
import { AboutPage } from '../about/about';
import { VerifyPage } from '../verify/verify';
import { UserData } from '../../providers/user-data';

import { SdkService } from "../../services/sdk-service";

@Component({
  selector: 'page-user',
  templateUrl: 'signup.html'
})
export class SignupPage {
  signup: {username?: string, password?: string} = {};
  submitted = false;

  unlock: {password?: string, submitted?: boolean} = {};
  initStorage: {password?: string, passwordCheck?: string} = {};
  createNewClicked : boolean = false;

  constructor(public navCtrl: NavController, public userData: UserData, public sdk: SdkService) {}

  onSignup(form) {
    this.submitted = true;

    if (form.valid) {
      //this.userData.signup(this.signup.username);
      //this.navCtrl.push(LoggedInPage);
    }
  }

  isPasswordSet() : Boolean {
      return this.sdk.initiated();
  };

  tryPassword(password : String) : Boolean {
            if (password && this.sdk.unlock(password)) {
		console.log("successfully tried password");
	    this.navCtrl.push(VerifyPage);
                //this.navCtrl.push(TransfersPage);
		return true;
                //$state.go('navBar.transactions');
            } else {return false;}
  };

  createPassword(form) : Boolean {
	console.log("Starting to check pass: ",this.initStorage.password, " with: ",this.initStorage.passwordCheck);
	if (this.initStorage.password == this.initStorage.passwordCheck) {
            this.sdk.initLocalStorage(this.initStorage.password);
	    this.navCtrl.push(VerifyPage);
	    //this.navCtrl.push(AboutPage);
	}
	return false;
  };

  createNew(email : String) {
            if (email) {
                console.log('create new account with email: ' + email);
                //this.navCtrl.push(InitStoragePage);
               // $state.go('initStorage', {email: email});
            } else {
                console.log('email undefined')
            }
  	this.createNewClicked = true;
  };

}
