import {Injectable} from '@angular/core';

import {Events} from 'ionic-angular';
import {Storage} from '@ionic/storage';


@Injectable()
export class UserData {
  private static HAS_LOGGED_IN = 'hasInitialized';
  private static HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

  constructor(public events: Events, public storage: Storage) {
  }

  login(username) {
    this.storage.set(UserData.HAS_LOGGED_IN, true);
    this.setUsername(username);
    this.events.publish('user:login');
  };

  signup(username) {
    this.storage.set(UserData.HAS_LOGGED_IN, true);
    this.setUsername(username);
    this.events.publish('user:signup');
  };

  logout() {
    this.storage.remove(UserData.HAS_LOGGED_IN);
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
    return this.storage.get(UserData.HAS_LOGGED_IN)
  };

  hasLoggedIn() {
    return this.storage.get(UserData.HAS_LOGGED_IN)
  };

  checkHasSeenTutorial() {
    return this.storage.get(UserData.HAS_SEEN_TUTORIAL)
  };


}
