import {Injectable} from '@angular/core';

import {Events} from 'ionic-angular';
import {Storage} from '@ionic/storage';

import {SdkService} from '../services/sdk-service';

@Injectable()
export class UserData {
  private static HAS_SEEN_TUTORIAL = 'hasSeenTutorial';


  constructor(public events: Events, public storage: Storage, private sdk: SdkService) {
  }

  login(secret) {
    //this.setUsername(username);
    //this.sdk.unlock(secret);
    
  };

  signup(username) {
    this.setUsername(username);
    this.events.publish('user:signup');
  };

  logout() {
    this.storage.remove(UserData.HAS_SEEN_TUTORIAL);
    this.storage.remove('username');
    this.events.publish('user:logout');
  };

  skipTutorial() {
    this.storage.set(UserData.HAS_SEEN_TUTORIAL, true);
  }

  setUsername(username) {
    this.storage.set('username', username);
  };

  getUsername() {
    return this.storage.get('username')
  };

  //TODO: sdk implementation
  hasInitialized() {
    return Promise.resolve(!!(this.sdk.initiated()));
    //return this.storage.get(UserData.HAS_LOGGED_IN)
  };

  hasLoggedIn() {
    return Promise.resolve(!!(this.sdk.isUnlocked()));
    //return this.storage.get(UserData.HAS_LOGGED_IN)
  };

  checkHasSeenTutorial() {
    return this.storage.get(UserData.HAS_SEEN_TUTORIAL)
  };


}
