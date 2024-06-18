import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { GuidModalComponent } from '../guidModal/guidModal.component';
import { MapDialog } from '../mapDialog/mapDialog.Component';
@Component({
  selector: 'app-register-page',
  templateUrl: './register-panel.component.html',
  styleUrls: ['./register-panel.component.css'],
})
export class RegisterPageComponent implements OnInit {
  model: any = {};
  codeSent: boolean;
  cityTxt: string = '';
  flon: any;
  flat: any;
  version: string = '';
  App_Title: string = '';
  isDesktop: boolean;
  strStaticCityCode: string;
  staticCodeState: string;
  location: any = [51.339329,35.6975868];
  states: any;
  city: any;

  reqModel: FormGroup = this.formBuilder.group({
    strMobile: new FormControl(''),
    strFamily: new FormControl(''),
    strName: new FormControl(''),
    strPassword: new FormControl(''),
    staticCodeState: new FormControl(1),
    strStaticCityCode: new FormControl(1),
    tiSex: new FormControl(1),
    fLat: new FormControl(),
    fLon: new FormControl(),
  });

  constructor(
    private accountService: AccountService,
    private toastr: ToastrService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private deviceService: DeviceDetectorService,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit(): void {
    this.isDesktop = this.deviceService.isDesktop();
    this.strStaticCityCode = (<any>window).strStaticCityCode;
    this.App_Title = (<any>window).App_Title;
    this.model.tiSex = 1;
    this.model.staticCodeState = 'option2';
    this.model.strStaticCityCode = -1;
    // this.route.params.subscribe((params) => {
    //   this.flon = params['flon'] == undefined ? 0 : params['flon'];
    //   this.flat = params['flat'] == undefined ? 0 : params['flat'];
    //   this.model.fLat = this.flat;
    //   this.model.fLon = this.flon;
    //   if (this.flon != 0 && this.flat != 0) {
    //     this.model.strMobile = window.localStorage.getItem("phone");
    //     this.model.strName = window.localStorage.getItem("name");
    //     this.model.strFamily = window.localStorage.getItem("family");
    //     this.model.strPassword = window.localStorage.getItem("pass")
    //     var model = {
    //       flon: this.flon,
    //       flat: this.flat
    //     }
    //     this.getCityName(model);
    //   }
    // });

    this.version = (<any>window).version;

    this.accountService.GetState().subscribe((response) => {
      this.states = response;
    });
  }
  changeCity(e) {
    // console.log(e.target.value);
    this.accountService.GetCity(e.target.value).subscribe((response) => {
      this.city = response;
    });
  }

  getCityName(model: any) {
    this.accountService.cityName(model).subscribe((response) => {
      let res = JSON.stringify(response);
      let resParse = JSON.parse(res);
      switch (resParse.iResult) {
        case -2:
          this.model.strCityCode = '';
          this.model.strVilageCode = '';
          this.toastr.error('شهر/روستا انتخاب شده تحت پوشش سامانه نمی باشد');
          break;
        case 0:
          this.model.strCityCode = '';
          this.model.strVilageCode = '';
          this.toastr.error('اطلاعات وارد شده اشتباه می باشد');
          break;
        case 1:
          this.cityTxt =
            resParse.strCityName != ''
              ? resParse.strCityName
              : resParse.strVillageName;
          this.reqModel.value.strCityCode = resParse.strCityCode;
          this.reqModel.value.strVilageCode = resParse.strVillageCode;
          break;
        default:
          break;
      }
    });
    this.model.strStaticCityCode = '';
    this.model.strStaticCityCode = -1;
  }
  register() {
    this.model = this.reqModel.value;

    if (this.model.strCityCode == '' || this.model.strVilageCode == '') {
      this.model.strStaticCityCode = ""
    }

    // console.log(this.model);

    if (this.model.strMobile == null || this.model.strMobile == '') {
      this.toastr.error('لطفا شماره موبایل را وارد کنید');
      return;
    }
    if (this.model.strName == null || this.model.strName == '') {
      this.toastr.error('لطفا نام خود را وارد کنید');
      return;
    }

    if (this.model.strPassword == null || this.model.strPassword == '') {
      this.toastr.error('لطفا رمز عبور   را وارد کنید');
      return;
    }
    if (!this.strStaticCityCode) {
      if (this.model.strCityCode == '' && this.model.strVillageCode == '') {
        this.toastr.error('لطفا مکان خود را مشخض کنید');
        return;
      }
    }

    this.accountService.register(this.model).subscribe((response) => {
      let res = JSON.stringify(response);
      let resParse = JSON.parse(res);
      // console.log(resParse)
      switch (resParse.iResult) {
        case 1:
          this.toastr.success('ثبت نام با موفقیت انجام شد');
          localStorage.clear();
          this.codeSent = true;
          var data = {
            CityCode: resParse.strCityCode,
            cityName: resParse.strCityName,
            VilageCode: resParse.strVillageCode,
            VilageName: resParse.strVillageName,
            name: resParse.strName,
            family: resParse.strFamily,
            mobile: resParse.strMobile,
            session: resParse.strSession,
            Id: resParse.iUserManager_User,
            strNationalCode: resParse.strNationalCode,
            strPassword: resParse.strPassword,
            img: resParse.strProfileImage,
            fLat: resParse.fLat,
            fLon: resParse.fLon,
            strBirthDate: resParse.strBirthDate,
            pass: this.model.strPassword,
            userName: this.model.strMobile,
            sex: resParse.tiSex,
            job: resParse.strJop,
            education: resParse.tiEducation,
            stars: resParse.tiStars,
          };
          //  localStorage.setItem('Info', JSON.stringify(data));
          break;
        case 0:
          this.toastr.error('شماره موبایل تکراری است');
          break;
        case -1:
          this.toastr.error('اطلاعات وارد شده کامل نیست');
          break;
        case -2:
          this.toastr.warning('شهر/روستا انتخاب شده تحت پوشش سامانه نمی باشد');
          break;
        default:
          break;
      }
    });
  }

  forgotPw(strMobile) {
    this.accountService.forgotPw(strMobile).subscribe((response) => {
      if (strMobile) {
        let res = JSON.stringify(response);
        let resParse = JSON.parse(res);
        switch (resParse.iResult) {
          case 1:
            this.toastr.success('ثبت نام با موفقیت');
            localStorage.setItem('shahrnik_hp', this.model.strMobile);
            this.codeSent = true;
            break;
          case 0:
            this.toastr.error('اطلاعات وارد شده صحیح نمیباشد');
            break;
          case -2:
            this.toastr.error('کاربری با این مشخصات وجود ندارد');
            break;
          case -3:
            this.toastr.warning(
              'حساب کاربری شما غیر فعال شده است، با مدیر سامانه تماس بگیرید'
            );
            break;
          case -4:
            this.toastr.warning('کد اعتبارسنجی برای شما ارسال شد');
          default:
            break;
        }
      } else {
        this.toastr.error('نام کاربری خود را وارد کنید');
      }
    });
  }
  mobile(data: any) {
    // console.log(data);

    window.localStorage.setItem('phone', data);
  }
  name(data: any) {
    window.localStorage.setItem('name', data);
  }
  family(data: any) {
    window.localStorage.setItem('family', data);
  }
  pass(data: any) {
    window.localStorage.setItem('pass', data);
  }
  openGuid() {
    let dialogRef = this.dialog.open(GuidModalComponent, {
      width: '70%',
      height: this.isDesktop ? '40%' : '60%',
      data: 1,
    });
  }
  delete_map() {
    this.cityTxt = '';
    this.reqModel.value.strCityCode = '';
    this.reqModel.value.strVilageCode = '';
  }

  checkOtp(strMobile, otp) {
    if (otp) {
      this.accountService.checkOtp(strMobile, otp).subscribe((response) => {
        let res = JSON.stringify(response);
        let resPars = JSON.parse(res);
        switch (resPars.iResult) {
          case 0:
            this.toastr.error('کد وارد شده اشتباه است');
            break;
          case 1:
            this.toastr.success('به شهرنیک خوش آمدید');
            var abilityModel = resPars;
            this.accountService
              .GetUserAbility(abilityModel)
              .subscribe((response2: any) => {
                //  console.log(response2);
                window.localStorage.setItem(
                  'ability',
                  JSON.stringify(response2)
                );
              });
            this.router.navigate(['shahrnik']);

            break;
          default:
            break;
        }
      });
    } else {
      this.toastr.error('لطفا کد ارسالی را وارد کنید');
    }
  }
  openMap() {
    let dialogRef = this.dialog.open(MapDialog, {
      width: '100%',
      data: this.location,
    });

    dialogRef.afterClosed().subscribe((res) => {
      //console.log(res);
      if (res) {
        this.flon = res.data[0];
        this.flat = res.data[1];
        this.location[0] = this.flon;
        this.location[1] = this.flat;
        this.model.fLat = this.flat;
        this.model.fLon = this.flon;
        var model = {
          flon: this.flon,
          flat: this.flat,
        };
        this.getCityName(model);
      }
    });
  }
}
