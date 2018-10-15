import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { OneSignal } from '@ionic-native/onesignal';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(private oneSignal: OneSignal, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();

      this.oneSignal.startInit('ef3fc133-0f6c-44f6-b862-b60f29cca0da', '713119621249');

      this.oneSignal.getIds().then(data => {
        alert(JSON.stringify(data));
      }, err => {
        
      })

      this.oneSignal.endInit();

    });
  }
}

