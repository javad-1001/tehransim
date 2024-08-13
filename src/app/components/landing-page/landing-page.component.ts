import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  forwardRef,
} from '@angular/core';

// import { BusinessDetailComponent } from '../business-detail/business-detail.component';

import { Router } from '@angular/router';

import { OtherService } from 'src/app/services/other.service';

import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';

import { MatSnackBar } from '@angular/material/snack-bar';

import { filter, map } from 'rxjs';

import { AccountService } from 'src/app/services/account.service';

declare var bootstrap: any;

@Component({

  selector: 'app-landing-page',

  templateUrl: './landing-page.component.html',

  styleUrls: ['./landing-page.component.css'],

  // providers: [BusinessDetailComponent],
})

export class LandingPageComponent implements OnInit {

  isLogin: boolean;

  ability: any;

  states: any;

  region: any;

  mobileUser: boolean;

  diar_UserInfo: any = {};

  defaultUserCity: any = {};

  list_City: any = [];

  // constructor(private businessDetailComponent: BusinessDetailComponent) { }

  constructor(

    private router: Router,

    private otherService: OtherService,

    private swUpdate: SwUpdate,

    private snackBar: MatSnackBar,

    private accountService: AccountService

  ) { }

  ngOnInit(): void {
    this.diar_UserInfo.strCityCode = -1
    this.defaultUserCity.strCityCode = -1
    let screenWidth = window.innerWidth;

    if (screenWidth <= 521) this.mobileUser = true;

    this.checkIfVersionUpdated();

    this.otherService.getAppAbility().subscribe((data) => {

      this.ability = data;

    })

    if (this.accountService.list_StoredCity.length == 0) {

      this.accountService.Dyar_City_List().subscribe((data) => {

        let res = JSON.parse(data.toString());

        this.list_City = res;

        // console.log(this.list_City);
        

        this.accountService.list_StoredCity = res;

      });


    }

    if (this.accountService.list_StoredCity.length != 0) {

      this.list_City = this.accountService.list_StoredCity;

    }

    this.otherService.isUserLogin$.subscribe((condition) => {

      this.isLogin = condition;

      if (condition) {
        this.diar_UserInfo = {
          strFullName:
            this.otherService.getLocalStorage().name +
            ' ' +
            this.otherService.getLocalStorage().family,

          strMobile: this.otherService.getLocalStorage().mobile,

          strCityName: this.otherService.getLocalStorage().cityName,
        };
      }

    });
    // console.log();

    this.otherService.isUserSelectedCity$.subscribe((condition) => {

      if (condition) this.defaultUserCity = this.otherService.get_defaultCity();

      else this.defaultUserCity = {};

    });

    if (this.isLogin) {

      this.diar_UserInfo = {

        strFullName:

          this.otherService.getLocalStorage().name + ' ' +

          this.otherService.getLocalStorage().family,

        strMobile: this.otherService.getLocalStorage().mobile,

        strCityName: this.otherService.getLocalStorage().cityName,

        strCityCode: this.otherService.getLocalStorage().CityCode,

      };

      

    }

  }

  stepBackToHome() {
    this.router.navigate(['/qrond/home']);
  }

  changeRoute(path: string) {

    // if (!this.isLogin && path != 'home' && path != 'search') return this.login(path);

    // if (path == 'search') return this.router.navigate([`dyar/search/${this.accountService.tiType_Stored ? this.accountService.tiType_Stored : -1}`])

    this.router.navigate([`/qrond/${path}`]);

  }

  changeCity(e) {
    // console.log(e);
    var selectedCity = {
      strCityCode: e.CityCode.trim(),

      strCityName: e.strCityName.trim(),
    };

    localStorage.removeItem('dc30al1i7rez0ab02');

    localStorage.setItem(
      'dc30al1i7rez0ab02',
      this.accountService.encrypt(JSON.stringify(selectedCity))
    );

    this.otherService.changeUserSelectedCity_Status(true);
  }

  callOpenSignUpModal() {
    // if (this.businessDetailComponent) {
    //   this.businessDetailComponent.open_SigUpModal();
    // } else {
    //   console.error('BusinessDetailComponent is not available.');
    // }
  }

  login(redirectTo: string) {
    this.router.navigate([`/dyar/login/${redirectTo}`]);
  }

  logOut() {
    this.otherService.logout();

    this.router.navigate(['/dyar/home']);
  }

  changeDefault_City(item) {

    var selectedCity = {

      strCityCode: item ? item.CityCode.trim() : -1,

      strCityName: item ? item.strCityName.trim() : ' همه شهر ها ',

    };

    localStorage.removeItem('dc30al1i7rez0ab02');

    localStorage.setItem('dc30al1i7rez0ab02', this.accountService.encrypt(JSON.stringify(selectedCity)));

    this.otherService.changeUserSelectedCity_Status(true);

    window.location.reload();

  }

  openloC() {
    var myModal = new bootstrap.Modal(document.getElementById('Modal'), {});
    myModal.show();
  }

  checkIfVersionUpdated() {
    console.log(
      '________________________ Welcome to Dyar  ________________________'
    );

    this.swUpdate.versionUpdates
      .pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        map((evt) => ({
          type: 'UPDATE_AVAILABLE',

          current: evt.currentVersion,

          available: evt.latestVersion,
        }))
      )
      .subscribe((evt) => {
        let snack = this.snackBar.open(
          'نسخه جدیدی منتشر شده است !!',
          'به روز رسانی',
          {
            panelClass: ['snackBar-class'],
          }
        );

        snack.onAction().subscribe(() => {
          this.swUpdate.activateUpdate().then(() => {
            document.location.reload();
          });
        });
      });
  }

  openAdd() {
    window.open(
      `qrond/general`,

      '_blank'
    );
  }
  openAbout() {
    window.open(
      `qrond/about`,

      '_blank'
    );
  }

}
