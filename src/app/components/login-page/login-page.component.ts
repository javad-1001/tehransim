import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { OtherService } from 'src/app/services/other.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  model: any = {};

  codeSent: boolean;

  version: string = "";

  App: any;

  isDesktop: boolean;

  App_Title: string = "";

  constructor(
    private accountService: AccountService,
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private deviceService: DeviceDetectorService,
    private otherService: OtherService,
    private ActivatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {

    // Log In By SSO From Application

    if (this.route.snapshot.queryParamMap.get('SignUp')) {

      const appName = this.route.snapshot.queryParamMap.get('appName');

      localStorage.setItem('isFromApplication', 'yes');

      localStorage.setItem('android-appName', appName);

      window.location.href = 'https://ssokeshvar.moi.ir/oauth2/authorize?response_type=code&scope=openid profile&client_id=App.shahrnik&state=state1&redirect_uri=https://App.shahrnik.com';

      // window.location.href = 'https://ssokeshvar.moi.ir/oauth2/authorize?response_type=code&scope=openid profile&client_id=App.shahrnik&state=state1&redirect_uri=http://127.0.0.1:4200'

    }

    // Log In By SSO

    const isFromApplication = !!localStorage.getItem('isFromApplication');

    const code_url = this.route.snapshot.queryParamMap.get('code');

    if (code_url != null && !isFromApplication) {

      var model = { Code: code_url };

      this.accountService.SSOKeshvar_Step1(model).subscribe((data) => {

        let res = JSON.parse(data.toString());

        if (res.bError) {

          Swal.fire({

            title: res.strError,
            icon: 'error',
            showCancelButton: true,
            showConfirmButton: false,
            reverseButtons: true,
            allowOutsideClick: false,
            cancelButtonText: 'بستن'

          })
        }

        else {

          this.accountService.SSOKeshvar_Step2(JSON.parse(res)).subscribe((data) => {

            this.login(data)

          })

        }

      })

    }

    // Go Back To Application

    else if (code_url != null && isFromApplication) {

      const appName = localStorage.getItem('android-appName')

      const href = `${appName}://data?Code=${code_url}`;

      Swal.fire({

        title: `عملیات با موفقیت انجام شد`,
        icon: 'success',
        html: `<a href=${href}> <button id="sso-android" class="btn"> بازگشت به برنامه </button> </a>`,
        showCancelButton: false,
        showConfirmButton: false,
        reverseButtons: true,
        // showCloseButton: true,
        allowOutsideClick: false,


      })

      localStorage.removeItem('isFromApplication');

      localStorage.removeItem('android-appName')


    }


    this.isDesktop = this.deviceService.isDesktop();

    this.App_Title = (<any>window).App_Title;

    this.App = window.localStorage.getItem("AppName") ? window.localStorage.getItem("AppName") : "";

    let hp = this.otherService.getLocalStorage();

    this.version = (<any>window).version;

    if (hp != null && hp.userName && hp.pass) {

      this.model.strMobile = hp.userName;

      this.model.strPassword = hp.pass;

      this.login();

    }

  }

  login(resParse?) {

    if (typeof (resParse) == 'object') {

      switch (resParse.iResult) {
        case 1: this.toastr.success("به شهرنیک خوش آمدید");
          window.localStorage.setItem("AppName", resParse.strAppName)
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
            strCV: resParse.strCV,
            bValid: resParse.bValid,
            bVillage : resParse.bVillage 
          }

          localStorage.setItem('Info', JSON.stringify(data));
          var abilityModel = resParse;
          this.accountService.GetUserAbility(abilityModel).subscribe((response2: any) => {
            // console.log(response2);
            window.localStorage.setItem("ability", JSON.stringify(response2));
          });
          // console.log(resParse)
          this.router.navigate(['shahrnik']);
          break;
        case 0: this.toastr.error("اطلاعات وارد شده صحیح نمیباشد")
          break;
        case -2: this.toastr.error("کاربری با این مشخصات وجود ندارد");
          this.router.navigate(['register']);
          break;
        case -3: this.toastr.warning("حساب کاربری شما غیر فعال شده است، با مدیر سامانه تماس بگیرید");
          break;
        case -4: this.toastr.warning("کد اعتبارسنجی برای شما ارسال شد");
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
            strCV: resParse.strCV,
            bValid: resParse.bValid,
            bVillage : resParse.bVillage 

          }

          localStorage.setItem('Info', JSON.stringify(data));
          // console.log(window.localStorage.getItem);
          this.codeSent = true;
        default:
          break;
      }
    }

    else {

      this.accountService.login(this.model).subscribe(response => {

        let res = JSON.stringify(response);

        let resParse = JSON.parse(res);

        switch (resParse.iResult) {
          case 1: this.toastr.success("به شهرنیک خوش آمدید");
            window.localStorage.setItem("AppName", resParse.strAppName)
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
              strCV: resParse.strCV,
              bValid: resParse.bValid,
              bVillage : resParse.bVillage 

            }
            localStorage.setItem('Info', JSON.stringify(data));
            var abilityModel = resParse;
            this.accountService.GetUserAbility(abilityModel).subscribe((response2: any) => {
              // console.log(response2);
              window.localStorage.setItem("ability", JSON.stringify(response2));
            });
            // console.log(resParse)
            this.router.navigate(['shahrnik']);
            break;
          case 0: this.toastr.error("اطلاعات وارد شده صحیح نمیباشد")
            break;
          case -2: this.toastr.error("کاربری با این مشخصات وجود ندارد");
            this.router.navigate(['register']);
            break;
          case -3: this.toastr.warning("حساب کاربری شما غیر فعال شده است، با مدیر سامانه تماس بگیرید");
            break;
          case -4: this.toastr.warning("کد اعتبارسنجی برای شما ارسال شد");
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
              strCV: resParse.strCV,
              bValid: resParse.bValid,
              bVillage : resParse.bVillage 



            }

            localStorage.setItem('Info', JSON.stringify(data));
            // console.log(window.localStorage.getItem);
            this.codeSent = true;
          default:
            break;
        }
      })
    }

  }

  logIn_BySSO() {

    window.location.href = 'https://ssokeshvar.moi.ir/oauth2/authorize?response_type=code&scope=openid profile&client_id=App.shahrnik&state=state1&redirect_uri=https://App.shahrnik.com';

    // window.location.href = 'https://ssokeshvar.moi.ir/oauth2/authorize?response_type=code&scope=openid profile&client_id=App.shahrnik&state=state1&redirect_uri=http://127.0.0.1:4200'
  }

  forgotPw(strMobile) {
    this.otherService.showSpinner();
    this.accountService.forgotPw(strMobile).subscribe(response => {
      this.otherService.hideSpinner();

      if (strMobile) {
        let res = JSON.stringify(response);
        let resParse = JSON.parse(res)
        switch (resParse.iResult) {
          case 1: this.toastr.success("رمز ورود ارسال شد");
            localStorage.setItem('shahrnik_hp', this.model.strMobile);
            // this.codeSent = true;
            break;
          case 0: this.toastr.error("اطلاعات وارد شده صحیح نمیباشد")
            break;
          case -2: this.toastr.error("کاربری با این مشخصات وجود ندارد");
            break;
          case -3: this.toastr.warning("حساب کاربری شما غیر فعال شده است، با مدیر سامانه تماس بگیرید");
            break;
          case -4: this.toastr.warning("کد اعتبارسنجی برای شما ارسال شد");
          default:
            break;
        }
      } else {
        this.toastr.error("شماره موبایل خود را وارد کنید")
      }
    })
  }

  checkOtp(strMobile, otp) {
    if (otp) {
      this.accountService.checkOtp(strMobile, otp).subscribe(response => {
        let res = JSON.stringify(response);
        let resPars = JSON.parse(res);
        switch (resPars.iResult) {
          case 0: this.toastr.error("کد وارد شده اشتباه است")
            break;
          case 1: //this.toastr.show("به شهرنیک خوش آمدید")
            // var data = {
            //   CityCode: resPars.strCityCode,
            //   cityName: resPars.strCityName,
            //   VilageCode: resPars.strVillageCode,
            //   VilageName: resPars.strVillageName,
            //   name: resPars.strName,
            //   family: resPars.strFamily,
            //   mobile: resPars.strMobile,
            //   session: resPars.strSession,
            //   Id: resPars.iUserManager_User,
            //   strNationalCode: resPars.strNationalCode,
            //   strPassword: resPars.strPassword,
            //   img: resPars.strProfileImage,
            //   fLat: resPars.fLat,
            //   fLon: resPars.fLon,
            //   strBirthDate: resPars.strBirthDate,
            //   pass: this.model.strPassword,
            //   userName: this.model.strMobile,
            //   sex: resPars.tiSex,
            //   job: resPars.strJop,
            //   education: resPars.tiEducation,
            //   stars: resPars.tiStars,
            // }

            //localStorage.setItem('Info', JSON.stringify(data));
            var abilityModel = resPars;
            this.accountService.GetUserAbility(abilityModel).subscribe((response2: any) => {
              // console.log(response2);
              window.localStorage.setItem("ability", JSON.stringify(response2));
            });
            this.router.navigate(['shahrnik']);
            this.codeSent = false;
            break;
          default:
            break;
        }
      })
    }
    else {
      this.toastr.error("لطفا کد ارسالی را وارد کنید");
    }
  }
}
