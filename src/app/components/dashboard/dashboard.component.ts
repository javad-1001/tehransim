import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { OtherService } from 'src/app/services/other.service';
import { ToastrService } from 'ngx-toastr';
import { SwUpdate } from '@angular/service-worker';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { GuidModalComponent } from '../guidModal/guidModal.component';
declare var bootstrap: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  parameters: any = {};
  tasks: any = {};
  isDesktop: boolean;
  Info: any;
  slider: any;
  ability: any = {};
  showSlide: boolean = true;
  constructor(
    private accountService: AccountService,
    private router: Router,
    private deviceService: DeviceDetectorService,
    private otherService: OtherService,
    private toastr: ToastrService,
    private swUpdate: SwUpdate,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.Info = this.otherService.getLocalStorage();

    this.isDesktop = this.deviceService.isDesktop();
    var model = {
      iUserManager_User: this.Info.Id,

      strSession: this.Info.strSession,

      iHelpID: 31,
    };
    this.accountService.defaultHelp(model).subscribe((response) => {
      if (response !== '') {
        this.openGuid(model.iHelpID);
      }
    });

    setTimeout(() => {
      this.ability = this.otherService.getAbility();

      this.showSlide = this.ability.bAdvs;
    }, 1000);

    const interval = setInterval(() => {
      if (this.otherService.getAbility()) {
        this.ability = this.otherService.getAbility();
        this.showSlide = this.ability.bAdvs;
        clearInterval(interval);
      }
    }, 500) as any;
    this.Info = this.otherService.getLocalStorage();
    //GetCarusel
    this.getAdd();

    // this.checkIfVersionUpdated();
  }

  getAdd() {
    var model = {
      iUserManager_User: this.Info.Id,
      strSession: this.Info.session,
      strCityCode: this.Info.CityCode,
      strVillageCode: this.Info.VilageCode,
    };
    this.accountService.adds(model).subscribe((response) => {
      this.slider = response;
      // console.log(this.slider)
      //Create Carusel
      var myCarousel = document.querySelector('#myCarousel');
      var carousel = new bootstrap.Carousel(myCarousel);
    });
  }
  changeRoute(url, acsses) {
    // if (acsses == false) {
    //   this.toastr.error("شما مجوز ورود به این صفحه را ندارید");
    //   return;
    // }
    if (acsses == false) {
      this.toastr.warning('این قابلیت به زودی برای شما فعال می شود');
      return;
    }
    this.router.navigate([`${url}`]);
  }
  openGuid(item) {
    let dialogRef = this.dialog.open(GuidModalComponent, {
      width: '60%',
      //height:this.isDesktop? '40%':"60%" ,
      data: item,
    });
  }

  addVisit(id: string) {
    var model = {
      iAds: `${id}`,
    };
    this.accountService
      .addView(model, this.Info.Id, this.Info.session)
      .subscribe((response) => {});
  }
  showtoastr() {
    this.toastr.info('این بخش در موقعیت شما فعال نمی باشد');
  }

  ranomColor() {
    var color = 'hsl(' + Math.random() * 360 + ', 30%, 95%)';

    // console.clear();

    return color;

    // [ngStyle]="{'background':ranomColor(),'border':randomBorder()}"
  }

  randomBorder() {
    var border = '1px solid ';
    var o = Math.round,
      r = Math.random,
      s = 255;
    return (
      border +
      'rgba(' +
      o(r() * s) +
      ',' +
      o(r() * s) +
      ',' +
      o(r() * s) +
      ',' +
      r().toFixed(1) +
      ')'
    );
  }

  // checkIfVersionUpdated() {
  //   if (this.swUpdate.available) {
  //     this.swUpdate.available.subscribe(() => {
  //       let snack = this.snackBar.open('!نسخه جدید منتشر شده', 'به روز رسانی', {
  //         horizontalPosition: this.horizontalPosition,

  //         verticalPosition: this.verticalPosition,

  //         panelClass: ['snackBar-class'],
  //       });

  //       snack.onAction().subscribe(() => {
  //         this.swUpdate.activateUpdate().then(() => {
  //           location.reload();
  //         });
  //       });
  //     });
  //   }
  // }
}
