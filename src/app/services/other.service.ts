import { Injectable } from '@angular/core';

import { Router } from '@angular/router';

import { BehaviorSubject, interval, map, Observable, of, Subject } from 'rxjs';

import { AccountService } from './account.service';

@Injectable({

  providedIn: 'root',

})

export class OtherService {

  dataObserver: BehaviorSubject<any> = new BehaviorSubject(null);

  oservableSource: any;

  private isUserLogin: BehaviorSubject<boolean> = new BehaviorSubject(!!this.userModel().strSession);

  private isUserSelectedCity: BehaviorSubject<boolean> = new BehaviorSubject(!!this.get_defaultCity().strCityName)

  isUserLogin$ = this.isUserLogin.asObservable();

  isUserSelectedCity$ = this.isUserSelectedCity.asObservable();

  constructor(private router: Router, private accountService: AccountService) {

    this.oservableSource = this.dataObserver.asObservable();

    this.changeUserLogin_Status(!!this.userModel().strSession);

  }

  getBase64(file) {

    var reader = new FileReader();
    var result;
    reader.readAsDataURL(file);
    reader.onload = () => {
      result = reader.result;
      this.dataObserver.next(result);

    };
    reader.onerror = function (error) {
      // console.log('Error: ', error);
    };

  }

  showSpinner() {
    var sp = document.getElementById("loading") as any;
    sp.classList.remove("d-none");
  }

  hideSpinner() {
    var sp = document.getElementById("loading") as any;
    sp.classList.add("d-none");
  }

  changeUserLogin_Status(type: boolean) {

    this.isUserLogin.next(type)

  }

  changeUserSelectedCity_Status(type: boolean) {

    this.isUserSelectedCity.next(type)

  }

  getAppAbility(): Observable<any> {

    if (localStorage.getItem('db30a17alirezabhvso3l0ifr4z8ab0b02')) {

      var item = JSON.parse(this.accountService.decrypt(localStorage.getItem('db30a17alirezabhvso3l0ifr4z8ab0b02')!));

      return of(item);

    }

    else {

      return this.accountService.appAbility().pipe(

        map((response: any) => {

          var ability = JSON.parse(response);

          localStorage.setItem('db30a17alirezabhvso3l0ifr4z8ab0b02', this.accountService.encrypt(JSON.stringify(ability)));

          return ability;

        })

      );

    }

  }

  logout() {

    var selectedCity = this.get_defaultCity();

    window.localStorage.clear();

    this.changeUserLogin_Status(false);

    localStorage.setItem('dc30al1i7rez0ab02', this.accountService.encrypt(JSON.stringify(selectedCity)));

  }

  getLocalStorage() {

    if (localStorage.getItem('db30a17f18d1a8a3l0ifr4z8ab0b02')) {

      var item = JSON.parse(this.accountService.decrypt(localStorage.getItem('db30a17f18d1a8a3l0ifr4z8ab0b02')!))

      return item;

    }

    else return {}

  }

  get_defaultCity() {

    if (localStorage.getItem('dc30al1i7rez0ab02')) {

      var item = JSON.parse(this.accountService.decrypt(localStorage.getItem('dc30al1i7rez0ab02')!))

      return item;

    }

    else return {}

  }

  getAbility() {

    var item = localStorage.getItem('ability');

    return JSON.parse(item);

  }

  userModel() {

    var model = this.getLocalStorage();
    var data = {
      iUserManager_User: model.Id,
      strSession: model.session,
    };
    return data;
  }

  basicModel() {

    var model = this.getLocalStorage();

    var data = {

      strVillageCode: model.VilageCode,

      strCityCode: model.CityCode,

    };

    return data;
  }

  fullModel() {
    var model = this.getLocalStorage();
    var data = {
      strVillageCode: model.VilageCode,
      strCityCode: model.CityCode,
      iUserManager_User: model.Id,
      strSession: model.session,
    };
    return data;
  }

}