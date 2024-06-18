import { AfterViewInit, Component, OnInit, HostListener } from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { OtherService } from 'src/app/services/other.service';

import { Location } from '@angular/common';

import { AccountService } from 'src/app/services/account.service';

import { ToastrService } from 'ngx-toastr';

import { MatDialog } from '@angular/material/dialog';

import { DomSanitizer, SafeUrl, SafeHtml } from '@angular/platform-browser';

import Map from 'ol/Map';

import View from 'ol/View';

import OSM from 'ol/source/OSM';

import * as olProj from 'ol/proj';

import TileLayer from 'ol/layer/Tile';

import {
  DragRotateAndZoom,
  defaults as defaultInteractions,
} from 'ol/interaction';

import { Feature, Overlay } from 'ol';

import { Point } from 'ol/geom';

import VectorLayer from 'ol/layer/Vector';

import VectorSource from 'ol/source/Vector';

import { Icon, Style } from 'ol/style';

import Swal from 'sweetalert2';

import {
  debounce,
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  interval,
  pluck,
  takeUntil,
  takeWhile,
} from 'rxjs';

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { HttpClient } from '@angular/common/http';

declare var bootstrap: any;

@Component({
  selector: 'app-business-detail',

  templateUrl: './business-detail.component.html',

  styleUrls: ['./business-detail.component.css'],

  animations: [
    trigger('slideInOut', [
      state(
        'open',
        style({
          height: '*',

          overflow: 'hidden',

          opacity: '1',

          margin: '10px 0',
        })
      ),

      state(
        'closed',
        style({
          height: '0',

          overflow: 'hidden',

          opacity: '0',
        })
      ),

      transition('open <=> closed', [animate('0.4s ease-in-out')]),
    ]),
  ],
})
export class BusinessDetailComponent implements OnInit {
  fullscreen_ModalStyle: string = `

  max-width: 100vw !important;

  width: 100%;

  height: 100vh;

  max-height: 100vh;

  margin: 0 !important;

`;

  Info: any;
  htmlContent: any;

  information_ads: any = [];

  list_businessGallery: any;

  current_Image: any;

  current_ImageIndex: any;

  list_AdsImages: any = [];

  list_AdsImagesShown: any = [];

  list_City: any = [];

  mainImage_ads: any = '';

  selectedIndex: any = 0;

  isLoading: boolean = true;

  isLoading_2: boolean = true;

  bSendOtp: boolean = false;

  bLoginMode: boolean = true;

  isFromLoginForm: boolean = false;

  isFromAnotherComponent: boolean = false;

  rulesRead: boolean = false;

  isLogin: boolean;

  otpTimer: any | number = 0;

  map: any = {};

  id: string;

  type: string;

  sliderSimilar: any;

  iAdvertising: string;

  redirectTo: string;

  redirectTo_id: number | string | null = null;

  signUpModel: FormGroup = this.formBuilder.group({
    strMobile: new FormControl('', Validators.required),

    strEmail: new FormControl(''),

    strOtp: new FormControl(''),

    // rules: new FormControl(false),

    strName: new FormControl(''),

    strFamily: new FormControl('', Validators.required),

    tiSex: new FormControl(''),

    strCityCode: new FormControl('-1', Validators.required),

    strPassword: new FormControl(''),

    fLat: new FormControl(''),

    fLon: new FormControl(''),

    strImei: new FormControl(''),

    strActivateCode: new FormControl(''),

    rules: new FormControl(false),
  });

  carouselOptions = {
    items: 1,
    rtl: true,
    loop: true,
    autoplay: false,
    autoplayTimeout: 3000, // Adjust the autoplay timeout as needed
    autoplayHoverPause: true,
    dots: false,
    nav: false, // Set to true if you want navigation arrows
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      992: {
        items: 5,
      },
    },
  };

  constructor(
    public route: ActivatedRoute,

    private location: Location,

    private toastr: ToastrService,

    private router: Router,

    private dialog: MatDialog,

    private formBuilder: FormBuilder,

    private accountService: AccountService,

    private otherService: OtherService,

    private sanitizer: DomSanitizer,
    private http: HttpClient,

  ) {}

  @HostListener('window:beforeunload', ['$event'])

  
  ngOnInit(): void {
    this.accountService.Dyar_City_List().subscribe((data) => {
      let res = JSON.parse(data.toString());

      this.list_City = res;
    });

    this.route.url.pipe(pluck(0, 'path')).subscribe((segment: any) => {
      // if this page call for login

      if (segment == 'login') {
        this.route.paramMap.subscribe((params) => {
          this.redirectTo = params.get('redirectTo');

          this.redirectTo_id = params.get('id');
        });

        this.isFromAnotherComponent = true;

        this.isLoading = false;

        this.isLoading_2 = false;

        setTimeout(() => {
          this.open_SigUpModal();
        }, 100);
      }

      // if this page call for getting ads detail

      if (segment == 'ads') {
        this.route.paramMap.subscribe((params) => {
          this.id = params.get('id');

          this.type = params.get('type');

          this.iAdvertising = params.get('iAdvertising');

          this.Info = this.otherService.getLocalStorage();

          var model = {
            iUserManager_User: this.Info?.Id,

            strSession: this.Info?.session,

            iMainKey: this.id,

            tiType: this.type,

            iAdvertising: this.iAdvertising,
          };

          this.accountService.adsSimlarList(model).subscribe((response) => {
            let res = JSON.parse(response.toString());
            this.sliderSimilar = res;
          });

          this.accountService.getAds_Images(model).subscribe((response) => {
            let res = JSON.parse(response.toString());

            if (
              this.information_ads?.fLon != 0 &&
              this.information_ads?.fLon != 0
            ) {
              setTimeout(() => {
                this.newOpenMap(
                  this.information_ads.fLon,
                  this.information_ads.fLat
                );
              }, 200);
            }

            this.isLoading_2 = false;

            this.list_AdsImages = res;

            this.list_AdsImagesShown = res.slice(0, 3);

            this.list_AdsImages.forEach((item: any) => {
              // sanitize the URL properly

              item.strImage = 'data:image/jpeg;base64,' + item.strImage;

              // item.strImage = this.sanitizer.bypassSecurityTrustUrl(
              //   item.strImage
              // ) as SafeUrl;

              if (item.bMain && item.bMain == true) this.mainImage_ads = item;
            });

            if (this.mainImage_ads == '')
              this.mainImage_ads = this.list_AdsImages[0];

            //  Save note for advertisements

            setTimeout(() => {
              var textArea_Note = document.getElementById('textArea_');

              fromEvent(textArea_Note, 'keyup')
                .pipe(
                  debounceTime(1000),
                  pluck('target', 'value'),
                  distinctUntilChanged()
                )
                .subscribe((data) => {
                  var model_ = {
                    iUserManager_User: this.Info?.Id,

                    strSession: this.Info?.session,

                    iAdvertising: this.iAdvertising,

                    strComment: data,
                  };

                  if (!this.isLogin) this.open_SigUpModal();
                  else this.accountService.Dyar_UpdateComment(model_);
                });
            }, 1000);
          });

          this.accountService
            .get_AdsDetail_VS_Check_Bookmark(model)
            .subscribe((response) => {
              this.isLoading = false;

              let adsDetail = JSON.parse(response.adsDetail.toString());

              let bookMark = JSON.parse(response.bookMark.toString());

              if (adsDetail?.bError) this.router.navigate(['/dyar/home']);

              if (adsDetail?.bError)
                return this.accountService.toastSwal(
                  'error',
                  adsDetail.strError
                );

              this.information_ads = adsDetail;
              // console.log(this.information_ads);

              if (bookMark.bError)
                return this.accountService.toastSwal(
                  'error',
                  bookMark.strError
                );

              this.information_ads = {
                ...this.information_ads,

                bookMark: bookMark.iResult,
              };
            });
        });
      }
    });

    // check user login status

    this.otherService.isUserLogin$.subscribe((condition) => {
      this.isLogin = condition;
    });

    this.http
    .get('../../../assets/basic/Ads_business_detail.html', { responseType: 'text' })
    .subscribe((data) => {
      this.htmlContent = data;
    });
  }

  getSafeHtml(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
  beforeUnloadHandler(event: Event) {
    // Display an alert before the user closes the page
    this.showAlertBeforeClosing();
  }

  showAlertBeforeClosing() {
    const confirmation = confirm('Are you sure you want to leave this page?');
    if (confirmation) {
      // User confirmed, proceed with closing the page
      
    } else {
      // User canceled, prevent the page from closing
      // You can choose to return false here if needed
    }
  }
  routeToMap(e) {
    const url = `https://www.google.com/maps?q=${e.fLat},${e.fLon}`;
    window.open(url, '_blank');
  }
  openAdd() {
    window.open(
      `dyar/general`,

      '_blank'
    );
  }
  checkRules(e) {
    this.rulesRead = e.target.checked;
    // console.log(this.rulesRead);
  }
  openPicFull(e) {
    var myModal = new bootstrap.Modal(document.getElementById('imgModal'), {});

    myModal.show();
  }
  getUser_Number() {
    if (!this.isLogin) this.open_SigUpModal();
    else {
      var model = {
        iUserManager_User: this.Info?.Id,

        strSession: this.Info?.session,

        iMainKey: this.id,

        tiType: this.type,

        iAdvertising: this.iAdvertising,
      };

      this.accountService.Dyar_adsUserInfo(model).subscribe((data) => {
        let res = JSON.parse(data.toString());

        if (res.bError)
          return this.accountService.toastSwal('error', res.strError);

        this.information_ads = {
          ...this.information_ads,
          strMobile: res.strMobile,
        };

        // Swal.fire({

        //   title: `شماره تماس آگهی گذار : ${res.strMobile}`,

        //   text: ' پیش از انجام معامله ، از صحت کالا یا خدمات ارائه‌شده ، به‌صورت حضوری اطمینان حاصل نمایید',

        //   icon: 'success',

        //   showCancelButton: true,

        //   showConfirmButton: true,

        //   reverseButtons: true,

        //   confirmButtonColor: '#10b981',

        //   confirmButtonText: 'تماس',

        //   cancelButtonText: 'بستن',

        // }).then((result) => {

        //   if (result.isConfirmed) window.location.href = 'tel:' + res.strMobile;

        // })
      });
    }
  }
  chatWith_advertiser() {
    if (!this.isLogin) this.open_SigUpModal();
    else this.router.navigate(['/dyar/chat']);
  }
  callWith_advertiser() {
    window.location.href = 'tel:' + this.information_ads.strMobile;
  }
  shareVia() {
    if (navigator.share) {
      navigator
        .share({
          url: window.location.href,

          title: this.information_ads.strTitle,
        })
        .then(() =>
         console.log('اشتراک گذاری موفق'))

        .catch(() =>
          this.accountService.toastSwal('error', 'متاسفانه خطایی رخ داده است')
        );
    } else
      this.accountService.toastSwal(
        'error',
        'قابلیت اشتراک گذاری برای شما پشتیبانی نمی شود'
      );
  }
  newOpenMap(...location) {
    if (location[0] == 0 || location[1] == 0) return;

    this.map = new Map({
      interactions: defaultInteractions().extend([new DragRotateAndZoom()]),

      target: 'test',

      layers: [
        new TileLayer({
          source: new OSM({}),
        }),
      ],

      view: new View({
        center: olProj.fromLonLat(location),

        zoom: 17,
      }),
    });

    const marker = new Feature({
      geometry: new Point(olProj.fromLonLat(location)),
    });

    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [marker],
      }),

      style: new Style({
        image: new Icon({
          src: '../../../assets/imgs/placeholder.png',
          scale: 0.5,
        }),
      }),
    });

    this.map.addLayer(vectorLayer);
  }

  open_SigUpModal() {
    this.signUpModel.reset();

    this.bLoginMode = true;

    this.bSendOtp = false;

    this.isFromLoginForm = false;

    this.signUpModel.get('strMobile').enable();

    var myModal = new bootstrap.Modal(
      document.getElementById('exampleModal'),
      {}
    );

    myModal.show();
  }

  bookmarkAds() {
    if (!this.isLogin) this.open_SigUpModal();
    else {
      var model = {
        iUserManager_User: this.Info?.Id,

        strSession: this.Info?.session,

        iMainKey: this.id,

        tiType: this.type,
      };

      this.accountService.Dyar_Add_Remove_Bookmark(model).subscribe((data) => {
        let res = JSON.parse(data.toString());

        if (res.bError)
          return this.accountService.toastSwal('error', res.strError);

        this.information_ads.bookMark =
          this.information_ads.bookMark == 1 ? 0 : 1;
      });
    }
  }

  login_User() {
    var model = {
      strMobile: this.signUpModel.get('strMobile')?.value,
    };

    this.accountService.Dyar_CheckMobile(model).subscribe((data) => {
      let res = JSON.parse(data.toString());

      if (res.bError)
        return this.accountService.toastSwal('error', res.strError);

      if (res == true) {
        // console.log('login_User')

        this.bLoginMode = false;

        this.bSendOtp = true;

        this.isFromLoginForm = true;

        this.signUpModel.get('strMobile').disable();

        setTimeout(() => {
          this.startOtp_Timer();
        }, 10);
      } else {
        // console.log('signUp_User')

        this.isFromLoginForm = false;

        this.bLoginMode = false;

        this.bSendOtp = false;

        this.signUpModel.controls['strCityCode'].setValue('-1');
      }
    });
  }

  signUp_User() {
    if (this.signUpModel.invalid)
      return this.accountService.toastSwal(
        'error',
        'لطفا موارد ستاره دار را پر کنید'
      );

    if (this.signUpModel.get('strMobile')?.value.length < 10)
      return this.accountService.toastSwal(
        'error',
        'لطفا شماره موبایل را به درستی وارد کنید'
      );

    if (this.signUpModel.get('strCityCode')?.value == '-1')
      return this.accountService.toastSwal(
        'error',
        'لطفا شهر محل سکونت خود را وارد کنید'
      );
    // if (this.signUpModel.get('rules')?.value == 'false')
    //   return this.accountService.toastSwal(
    //     'error',
    //     '  قوانین و مقررات را مطالعه و با آنها موافقت کنید'
    //   );

    this.accountService
      .Dyar_Register(this.setEmptyString4NullValues(this.signUpModel.value))
      .subscribe((data) => {
        let res = JSON.parse(data.toString());

        if (res.bError)
          return this.accountService.toastSwal('error', res.strError);

        this.bSendOtp = true;

        this.signUpModel.get('strMobile').disable();

        // console.log(res);

        setTimeout(() => {
          this.startOtp_Timer();
        }, 10);
      });
  }

  startOtp_Timer() {
    const changeNumber_btn = document.getElementById('changeNumber-btn');

    const onChangeNumberClicked$ = fromEvent(changeNumber_btn, 'click');

    interval(1000)
      .pipe(
        takeWhile((value) => value <= 60),

        takeUntil(onChangeNumberClicked$)
      )
      .subscribe({
        next: (value) => {
          const minutes = Math.floor((60 - value) / 60)
            .toString()
            .padStart(2, '0');

          const seconds = ((60 - value) % 60).toString().padStart(2, '0');

          this.otpTimer = `${minutes}:${seconds}`;
        },

        error: (err) => console.error(err),

        complete: () => (this.otpTimer = 0),
      });
  }

  check_Otp() {
    var model = {
      strMobile: this.signUpModel.get('strMobile')?.value,

      strActivateCode: this.signUpModel.get('strActivateCode')?.value,
    };

    this.accountService.Dyar_OtpCheck(model).subscribe((userData) => {
      let resParse = JSON.parse(userData.toString());

      if (resParse.bError)
        return this.accountService.toastSwal('error', resParse.strError);

      switch (resParse.iResult) {
        case 1:
          this.accountService.toastSwal(
            'success',
            ` ${resParse.strNikName} خوش آمدید `
          );

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

            // pass: this.model.strPassword,

            // userName: this.model.strMobile,

            sex: resParse.tiSex,

            job: resParse.strJop,

            education: resParse.tiEducation,

            stars: resParse.tiStars,

            strCV: resParse.strCV,

            bValid: resParse.bValid,

            email: resParse.strEmail,

            bDateFormat: resParse.bDateFormat,
          };

          localStorage.setItem(
            'db30a17f18d1a8a3l0ifr4z8ab0b02',
            this.accountService.encrypt(JSON.stringify(data))
          );

          // set user location to default selected city

          var selectedCity = {
            strCityCode: data.CityCode,

            strCityName: data.cityName,
          };

          localStorage.removeItem('dc30al1i7rez0ab02');

          localStorage.setItem(
            'dc30al1i7rez0ab02',
            this.accountService.encrypt(JSON.stringify(selectedCity))
          );

          this.otherService.changeUserSelectedCity_Status(true);

          this.Info = this.otherService.getLocalStorage();

          this.closeSignUp_Modal();

          var bookmarkModel = {
            iUserManager_User: this.Info?.Id,

            strSession: this.Info?.session,

            iMainKey: this.id,

            tiType: this.type,
          };

          this.accountService
            .Dyar_Check_Bookmark(bookmarkModel)
            .subscribe((data) => {
              let res = JSON.parse(data.toString());

              if (res?.bError)
                return this.accountService.toastSwal('error', res?.strError);

              this.information_ads = {
                ...this.information_ads,
                bookMark: res?.iResult,
              };
            });

          if (this.isFromAnotherComponent) {
            if (this.redirectTo_id)
              return this.router.navigate([
                `/dyar/${this.redirectTo}/${this.redirectTo_id}`,
              ]);
            else this.router.navigate([`/dyar/${this.redirectTo}`]);
          }

          this.otherService.changeUserLogin_Status(true);

          // Reset all stored value in service

          this.accountService.list_StoredAds = [];

          this.accountService.list_StoredCity = [];

          break;
      }
    });
  }

  sendAgain_Otp() {
    var model = {
      strMobile: this.signUpModel.get('strMobile')?.value,
    };

    this.accountService.Dyar_OtpAgain(model).subscribe((data) => {
      let res = JSON.parse(data.toString());

      if (res.bError)
        return this.accountService.toastSwal('error', res.strError);

      this.accountService.toastSwal('success', 'کد جدید ارسال شد');

      setTimeout(() => {
        this.startOtp_Timer();
      }, 10);
    });
  }

  backTo_ChangeNumber() {
    this.bSendOtp = false;
  }

  closeSignUp_Modal() {
    if (this.isFromAnotherComponent) this.router.navigate(['dyar/home']);

    let myModal = document.getElementById('exampleModal');

    var modal = bootstrap.Modal.getInstance(myModal);

    modal.hide();

    this.bLoginMode = true;

    this.bSendOtp = false;

    this.isFromLoginForm = false;

    this.signUpModel.get('strMobile').enable();
  }

  setEmptyString4NullValues(obj: any) {
    for (const key in obj) {
      if (obj[key] === null) obj[key] = '';
    }

    return obj;
  }

  openGallery(item: any) {
    this.current_Image = item;

    var myModal = new bootstrap.Modal(
      document.getElementById('full-gallery'),
      {}
    );

    myModal.show();
  }

  goToSupport() {
    if (!this.isLogin) {
      this.open_SigUpModal();
    } else {
      this.router.navigate(['dyar/support']);
    }
  }

  show_Warning_Before_Call() {
    if (!this.isLogin) return this.open_SigUpModal();

    Swal.fire({
      title: 'هشدار',

      text: ' هشدارهای لازم در خصوص عدم پرداخت هرگونه وجه و بررسی دقیق کالا و خدمات را مشاهده نموده‌ام و  نسبت به رعایت موارد امنیتی بر اساس قوانین و مقررات دیار اقدام خواهم نمود',

      icon: 'warning',

      showCancelButton: false,

      showConfirmButton: true,

      showCloseButton: true,

      confirmButtonText: 'مشاهده اطلاعات تماس',

      confirmButtonColor: '#10B981',
    }).then((result) => {
      if (result.isConfirmed) this.getUser_Number();
    });
  }

  next_Image() {
    const index = this.list_AdsImages.findIndex((x) => x == this.current_Image);

    if (index != -1) {
      if (index + 1 == this.list_AdsImages.length)
        return (this.current_Image = this.list_AdsImages[0]);

      this.current_Image = this.list_AdsImages[index + 1];
    }
  }

  prev_Image() {
    const index = this.list_AdsImages.findIndex((x) => x == this.current_Image);

    if (index != -1) {
      if (index == 0)
        return (this.current_Image =
          this.list_AdsImages[this.list_AdsImages.length - 1]);

      this.current_Image = this.list_AdsImages[index - 1];
    }
  }

  openDetail(item: any, index: number) {
    window.open(
      `dyar/ads/${item.iAdvertising}/${item.iMainKey}/${item.tiType}`,

      '_blank'
    );
  }

  closeImgModal() {
    let myModal = document.getElementById('full-gallery');

    var modal = bootstrap.Modal.getInstance(myModal);

    modal.hide();
  }

  subString_Title(text: string) {
    if (text?.length > 40) text = text.slice(0, 40) + '...';

    return text;
  }
}
