import { Component } from '@angular/core';
import { Validators,  FormControl, FormBuilder, FormGroup } from '@angular/forms';

import { Events, NavController } from 'ionic-angular';

import { TransfersPage } from '../transfers/transfers';
import { VerifyPage } from '../verify/verify';
import { SyncPage } from '../sync/sync';
import { UserData } from '../../providers/user-data';

import { SdkService } from "../../services/sdk-service";

@Component({ selector: 'page-user', templateUrl: 'signup.html' })
export class SignupPage {
  signup: {username?: string, password?: string} = {};
  submitted = false;

  unlock: {password?: string, submitted?: boolean} = {};
  initStorage: {password?: string, passwordCheck?: string} = {};
  createNewClicked : boolean = false;
  wrongPassword : boolean = false;
  private newPassword : FormGroup;

  constructor(
	public events: Events, 
	public navCtrl: NavController, 
        private formBuilder: FormBuilder,
	public userData: UserData, public sdk: SdkService) {

    this.newPassword = formBuilder.group({
      passwordEnter: ['', Validators.minLength(1)],
      passwordConfirm: ['', Validators.minLength(1)],
    }, {validator: this.areEqual} );
  }

  areEqual(group : FormGroup) {
	  var valid = true;
	  var previous = undefined;
	  var cname;

	  for (cname in group.controls) {
	    if (previous === undefined ) { previous = group.controls[cname].value; };
	    if (previous != group.controls[cname].value) { valid = false; };
	  }

	  if (valid) {
	    return null;
	  }

	  return {
	    areEqual: "Passwords are not equal."
	  };

  }

  onSignup(form) {
    this.submitted = true;

    if (form.valid) {
      //this.userData.signup(this.signup.username);
      //this.navCtrl.push(LoggedInPage);
    }
  }

  clearPass() {
      this.wrongPassword = false;
  }

  isPasswordSet() : Boolean {
      return this.sdk.initiated();
  };

  isUnlocked() : Boolean {
      return this.sdk.isUnlocked();
  };

  tryPassword(password : String) : Boolean {
            if (password && this.sdk.unlock(password)) {
		console.log("successfully tried password");
                this.events.publish('user:login');
	        this.navCtrl.setRoot(TransfersPage);
                //this.navCtrl.push(TransfersPage);
		return true;
                //$state.go('navBar.transactions');
            } else {
		this.wrongPassword=true;
	        return false;
	    }
  };

  createPassword(form) : Boolean {
	console.log("Starting to check pass: ",this.initStorage.password, " with: ",this.initStorage.passwordCheck);
	if (this.initStorage.password == this.initStorage.passwordCheck) {
            this.sdk.initLocalStorage(this.initStorage.password);
            this.events.publish('user:initiate');
	    this.navCtrl.setRoot(VerifyPage);
	    //this.navCtrl.push(AboutPage);
	}
	return false;
  };

  syncFromServer() {
	    this.navCtrl.push(SyncPage);
  }

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
