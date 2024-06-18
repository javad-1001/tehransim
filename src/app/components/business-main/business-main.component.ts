import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { DatePipe, Location } from '@angular/common';

import { OtherService } from 'src/app/services/other.service';

import { AccountService } from 'src/app/services/account.service';

import { pluck } from 'rxjs';

import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { HttpClient } from '@angular/common/http';

@Component({

  selector: 'app-business-main',

  templateUrl: './business-main.component.html',

  styleUrls: ['./business-main.component.css'],

})

export class BusinessMainComponent implements OnInit {

  mobileUser: boolean = false;

  posts: any = [];

  list_bookmark: any = [];

  Info: any = [];

  list_City: any = [];

  list_Category: any = [];

  isBookmark: boolean = false;

  bDateJalali: boolean = false;

  isRecentVisits: boolean = false;

  isSearch_done: boolean = false;

  ability: any;

  groups: any;

  groupsEmploy: any;

  subGroupsEmploy: any;

  subGroups: any;

  subGroupsSamsari: any;

  getCondiationList: any;

  cityList4Support: any;

  groupsSamsari: any;

  likes: any;

  Currency: any;

  brand4Car: any;

  class4Car: any;

  gearbox4Car: any;

  fuel4Car: any;

  htmlContent: any;

  filterModel: FormGroup = this.formBuilder.group({
    iUserManager_User: this.Info?.Id,

    strSession: this.Info?.session,

    strCityCode: new FormControl(''),

    strCity_Source: new FormControl(-1),

    strCity_Distination: new FormControl(-1),

    tiType: new FormControl('-1'),

    tiGroup: new FormControl(-1),

    tiCar_Brand: new FormControl(-1),
    tiCar_Class: new FormControl(-1),
    tiCar_GearboxType: new FormControl(-1),
    tiCar_FuelType: new FormControl(-1),

    tiSmoking: new FormControl(false),

    tiKeepingPets: new FormControl(false),

    tiBalcony: new FormControl(false),

    tiFree: new FormControl(false),

    tiDocuments: new FormControl(false),

    tiVisibleLoad: new FormControl(false),

    tiPassengerAssistance: new FormControl(false),

    tiWorkPermit: new FormControl(false),

    iSubGroup: new FormControl(-1),

    tiFurnishedStatus: new FormControl(-1),

    tiDoer: new FormControl(-1),

    tiSamsariCondiation: new FormControl(-1),

    iMinPrice: new FormControl(''),

    iMaxPrice: new FormControl(''),

    tiMinRooms: new FormControl(''),

    tiMaxRooms: new FormControl(''),

    iSYear: new FormControl(''),

    iEYear: new FormControl(''),

    strDischargeDate: new FormControl(''),
  });

  @ViewChild('budget', { static: false }) budget!: ElementRef<HTMLInputElement | any>;

  @ViewChild('budgetND', { static: false }) budgetND!: ElementRef<HTMLInputElement | any>;

  constructor(
    private router: Router,

    private route: ActivatedRoute,

    private location: Location,

    public accountService: AccountService,

    private otherService: OtherService,

    private formBuilder: FormBuilder,

    private datePipe: DatePipe,

    private toastr: ToastrService,

    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  carouselOptions = {
    items: 1,
    rtl: true,
    loop: true,
    autoplay: true,
    autoplayTimeout: 3000, // Adjust the autoplay timeout as needed
    autoplayHoverPause: true,
    dots: false,
    nav: false, // Set to true if you want navigation arrows
    responsive: {
      0: {
        items: 4,
      },
      768: {
        items: 8,
      },
      992: {
        items: 10,
      },
    },
  };

  getSafeHtml(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

  ngOnInit(): void {

    let screenWidth = window.innerWidth;

    if (screenWidth >= 992) this.mobileUser = true;

    this.Info = this.otherService.getLocalStorage();

    this.accountService.Advertising_Like_List().subscribe((data) => {

      let res = JSON.parse(data.toString());

      this.likes = res;

    });

    if (this.accountService.bDateJalali_Stored != null) {

      this.accountService.bDateJalali_Stored = this.bDateJalali;
    }

    if (this.accountService.bDateJalali_Stored == null) {

      this.accountService.dateFormat().subscribe((response: any) => {

        this.bDateJalali != response;

        this.accountService.bDateJalali_Stored = this.bDateJalali;

      });

    }

    this.otherService.getAppAbility().subscribe((data) => {

      this.ability = data;

    });

    this.filterModel.valueChanges.subscribe((data) => {

      if (this.filterModel.value.strDischargeDate != null && this.filterModel.value.strDischargeDate != null) {

        var startDate: any = this.datePipe.transform(this.filterModel.value.strDischargeDate, 'yyyy-MM-dd');

        this.filterModel.value.strDischargeDate = startDate;

      }

    });

    this.route.url.pipe(pluck(0, 'path')).subscribe((segment: any) => {

      if (this.accountService.list_StoredCity.length == 0) {

        this.accountService.Dyar_City_List().subscribe((data) => {

          let res = JSON.parse(data.toString());

          this.list_City = res;

          this.accountService.list_StoredCity = res;

        });
      }

      if (this.accountService.list_StoredCity.length != 0) {

        this.list_City = this.accountService.list_StoredCity;
      }

      if (segment == 'bookmarks') {

        this.isBookmark = true;

        this.filterModel.controls['tiType'].setValue(-1);

        this.getBookmarks();
      }

      if (segment == 'recent-visits') {

        this.isRecentVisits = true;

        this.filterModel.controls['tiType'].setValue(-1);

        this.getRecentVisits();
      }

      if (segment == 'business-recent-visits') {

        this.isRecentVisits = true;

        this.filterModel.controls['tiType'].setValue(-1);

        this.getRecentVisitsBusiness();
      }

      if (segment == 'business-bookmarks') {

        this.isRecentVisits = true;

        this.filterModel.controls['tiType'].setValue(-1);

        this.getRecentLikedBusiness();
      }

      if (segment == 'search') {

        this.route.paramMap.subscribe((params) => {

          this.filterModel.controls['tiType'].setValue(params.get('tiType'));

          if (this.accountService.list_StoredAds.length == 0) {

            if (this.otherService.get_defaultCity().strCityCode) {

              this.filterModel.controls['strCityCode'].setValue(this.otherService.get_defaultCity().strCityCode);

              this.getAllPosts(this.filterModel.get('tiType')?.value);

            }

            else {

              this.getAllPosts(this.filterModel.get('tiType')?.value);

            }

          }

          else {

            if (this.accountService.tiType_Stored != this.filterModel.get('tiType')?.value) {

              this.getAllPosts(this.filterModel.get('tiType')?.value);


            }

            else {

              this.posts = this.accountService.list_StoredAds;

              this.filterModel.controls['tiType'].setValue(this.accountService.tiType_Stored);

            }

          }

        });

      }

    });

    this.otherService.isUserLogin$.subscribe((condition) => {

      if (condition) {
        if (this.otherService.get_defaultCity().strCityCode)
          this.filterModel.controls['strCityCode'].setValue(
            this.otherService.get_defaultCity()?.strCityCode
          );
        else
          this.filterModel.controls['strCityCode'].setValue(
            this.otherService.basicModel().strCityCode
          );
      }

      if (!condition && this.accountService.list_StoredAds.length == 0) {
        if (this.otherService.get_defaultCity().strCityCode) {
          this.filterModel.controls['strCityCode'].setValue(
            this.otherService.get_defaultCity()?.strCityCode
          );
        } else this.filterModel.controls['strCityCode'].setValue('');
      }

    });

    this.otherService.isUserSelectedCity$.subscribe((condition) => {

      if (condition && this.otherService.get_defaultCity().strCityCode) {
        this.filterModel.controls['strCityCode'].setValue(
          this.otherService.get_defaultCity()?.strCityCode
        );
      }

      else {

        this.filterModel.controls['strCityCode'].setValue(

          this.otherService.basicModel().strCityCode

        );
      }

    });

    this.getBasicDate();

    this.http.get('../../../assets/basic/Ads_business_search.html', { responseType: 'text' }).subscribe((data) => {

      this.htmlContent = data;

    });

  }

  ngAfterViewInit() {
    this.filterModel.controls['strDischargeDate'].setValue('');
  }

  getBasicDate() {
    if (this.accountService.list_StoredCurrency != '') {
      this.Currency = this.accountService.list_StoredCurrency;
    }

    if (this.accountService.list_StoredCurrency == '') {
      this.accountService.getCurrency().subscribe((data) => {
        this.Currency = data;

        this.accountService.list_StoredCurrency = this.Currency;
      });
    }

    // -------------------------------------------------------

    if (this.accountService.list_StoredCondition.length != 0) {
      this.getCondiationList = this.accountService.list_StoredCondition;
    }

    if (this.accountService.list_StoredCondition.length == 0) {
      this.accountService.getCondiationList().subscribe((data) => {
        let res = JSON.parse(data.toString());

        this.getCondiationList = res;

        this.accountService.list_StoredCondition = this.getCondiationList;
      });
    }

    // -------------------------------------------------------

    if (this.accountService.list_Stored_CityList4Support.length != 0) {
      this.cityList4Support = this.accountService.list_Stored_CityList4Support;
    }

    if (this.accountService.list_Stored_CityList4Support.length == 0) {
      this.accountService.Dyar_City_ListSupport().subscribe((data) => {
        let res = JSON.parse(data.toString());

        this.cityList4Support = res;

        this.accountService.list_Stored_CityList4Support =
          this.cityList4Support;
      });
    }

    // -------------------------------------------------------

    if (this.accountService.list_Stored_groups.length != 0) {
      this.groups = this.accountService.list_Stored_groups;
    }

    if (this.accountService.list_Stored_groups.length == 0) {
      this.accountService.getRealStateGroupListSearch().subscribe((data) => {
        let res = JSON.parse(data.toString());

        this.groups = res;

        this.accountService.list_Stored_groups = this.groups;
      });
    }

    // -------------------------------------------------------

    if (this.accountService.list_Stored_groupsSamsari.length != 0) {
      this.groupsSamsari = this.accountService.list_Stored_groupsSamsari;
    }

    if (this.accountService.list_Stored_groupsSamsari.length == 0) {
      this.accountService.getGroupListSearch().subscribe((data) => {
        let res = JSON.parse(data.toString());

        this.groupsSamsari = res;

        this.accountService.list_Stored_groupsSamsari = this.groupsSamsari;
      });
    }

    // -------------------------------------------------------

    if (this.accountService.list_Stored_groupsEmploy.length != 0) {
      this.groupsEmploy = this.accountService.list_Stored_groupsEmploy;
    }

    if (this.accountService.list_Stored_groupsEmploy.length == 0) {
      this.accountService.getResumeGroupListSearch().subscribe((data) => {
        let res = JSON.parse(data.toString());

        this.groupsEmploy = res;

        this.accountService.list_Stored_groupsEmploy = this.groupsEmploy;
      });
    }
    // -------------------------------------------------------
    this.accountService.Car_Brand_List_Info().subscribe((data) => {
      let res = JSON.parse(data.toString());
      this.brand4Car = res;
    });
    this.accountService.Car_Class_List_Info().subscribe((data) => {
      let res = JSON.parse(data.toString());
      this.class4Car = res;
    });
    this.accountService.Car_GearboxType_List_Info().subscribe((data) => {
      let res = JSON.parse(data.toString());
      this.gearbox4Car = res;
    });
    this.accountService.Car_FuelType_List_Info().subscribe((data) => {
      let res = JSON.parse(data.toString());
      this.fuel4Car = res;
    });
  }

  onBudget(type) {
    if (type === 1) {
      var number = this.budget.nativeElement.value.replace(/[^0-9]/g, '');

      this.budget.nativeElement.value = number
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    if (type === 1) {
      var number = this.budgetND.nativeElement.value.replace(/[^0-9]/g, '');

      this.budgetND.nativeElement.value = number
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    if (type === 2) {
      // var number = this.moneyProgress.nativeElement.value.replace(/[^0-9]/g, '');
      // this.moneyProgress.nativeElement.value = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }

  showSubGroup(e) {
    this.filterModel.value.iSubGroup = -1;

    var model = this.filterModel.value;

    model.iUserManager_User = this.Info?.Id;

    model.strSession = this.Info?.session;

    let Id = this.filterModel.value.tiGroup;

    if (Id == -1) {
      this.subGroups = [];

      this.subGroupsSamsari = [];

      this.subGroupsEmploy = [];

      this.filterModel.value.iSubGroup = -1;

      this.filterModel.value.tiGroup = -1;

      this.postBySub();
    } else {
      this.postBySub();

      if (e == 4) {
        this.accountService
          .getRealStateSubGroupListSearch(Id)

          .subscribe((response) => {
            let res = JSON.parse(response.toString());

            this.subGroups = res;
          });
      }

      if (e == 0) {
        this.accountService.getSubGroupListSearch(Id).subscribe((response) => {
          let res = JSON.parse(response.toString());

          this.subGroupsSamsari = res;
        });
      }

      if (e == 2) {
        this.accountService
          .getResumeSubGroupListSearch(Id)
          .subscribe((response) => {
            let res = JSON.parse(response.toString());

            this.subGroupsEmploy = res;
          });
      }
    }
  }

  postBySub() {
    var model = this.filterModel.value;

    model.tiSmoking = model.tiSmoking == false ? -1 : 1;

    model.tiKeepingPets = model.tiKeepingPets == false ? -1 : 1;

    model.tiBalcony = model.tiBalcony == false ? -1 : 1;

    model.tiFree = model.tiFree == false ? -1 : 1;

    model.tiPassengerAssistance = model.tiPassengerAssistance == false ? -1 : 1;

    model.tiWorkPermit = model.tiWorkPermit == false ? -1 : 1;

    model.tiDocuments = model.tiDocuments == false ? -1 : 1;

    model.tiVisibleLoad = model.tiVisibleLoad == false ? -1 : 1;

    model.iMaxPrice = model.iMaxPrice == '' ? -1 : model.iMaxPrice;

    model.iMinPrice = model.iMinPrice == '' ? -1 : model.iMinPrice;

    model.tiMaxRooms = model.tiMaxRooms == '' ? -1 : model.tiMaxRooms;

    model.tiMinRooms = model.tiMinRooms == '' ? -1 : model.tiMinRooms;

    model.iEYear = model.iEYear == '' ? -1 : model.iEYear;

    model.iSYear = model.iSYear == '' ? -1 : model.iSYear;

    model.strCity_Distination =
      model.strCity_Distination == -1 ? '' : model.strCity_Distination;

    model.strCity_Source =
      model.strCity_Source == -1 ? '' : model.strCity_Source;

    model.strDischargeDate = model?.strDischargeDate
      ? model.strDischargeDate
      : '';

    this.accountService.adsList(model).subscribe((response) => {
      let res = JSON.parse(response.toString());

      this.accountService.list_StoredAds = res;

      this.posts = res;
    });
  }

  getAllPosts(tiType: number, isCity?: string) {

    if (tiType != this.filterModel.get('tiType')?.value && !this.isBookmark && !this.isRecentVisits) {

      this.router.navigate([`/dyar/search/${tiType}`]);

    }

    this.filterModel.controls['tiType'].setValue(tiType);

    if (isCity) {

      var selectedCity = {

        strCityCode: this.filterModel.get('strCityCode').value,

        strCityName: this.getStrName('strCity').replace(/"/g, ''),

      };

      localStorage.removeItem('dc30al1i7rez0ab02');

      localStorage.setItem('dc30al1i7rez0ab02', this.accountService.encrypt(JSON.stringify(selectedCity)));

      this.otherService.changeUserSelectedCity_Status(true);

    }

    if (!this.isBookmark && !this.isRecentVisits) {

      this.accountService.tiType_Stored = tiType;

    }

    if (this.isBookmark || this.isRecentVisits) {

      this.isSearch_done = false;

      if (tiType == -1) return (this.posts = this.list_bookmark);

      this.posts = this.list_bookmark.filter((el: any) => {

        return el?.tiType == tiType;

      });

      this.isSearch_done = true;
    }

    else {

      var model = {

        iUserManager_User: this.Info?.Id,

        strSession: this.Info?.session,

        tiType: tiType,

        strCityCode: this.filterModel.get('strCityCode').value != ''

          ? this.filterModel.get('strCityCode').value

          : this.otherService.basicModel().strCityCode,
      };

      this.isSearch_done = false;

      this.accountService.adsList(model).subscribe((response) => {

        this.posts = JSON.parse(response.toString());

        this.filterModel.controls['strDischargeDate'].setValue('');

        this.filterModel.controls['tiGroup'].setValue(-1);

        this.filterModel.controls['iSubGroup'].setValue(-1);

        if (this.posts.bError) return this.accountService.toastSwal('error', this.posts.strError + ' Advertisements ');

        this.accountService.list_StoredAds = JSON.parse(response.toString());

        if (!this.posts.length) this.accountService.list_StoredAds.push({ noResult: 'yes' })

        this.isSearch_done = true;

      });
    }
  }

  filterBookmarkByCity() {
    // if (this.filterModel.get('tiType')?.value == -1) return this.posts = this.list_bookmark;
    // this.posts = this.list_bookmark.filter((el: any) => {
    //   return this.filterModel.get('tiType')?.value != -1 ?
    //     (el?.tiType == this.filterModel.get('tiType')?.value && el?.strCityCode.trim() == this.filterModel.get('strCityCode')?.value.trim()) :
    //     (el?.strCityCode.trim() == this.filterModel.get('strCityCode')?.value.trim())
    // })
  }

  getBookmarks() {
    var model = {
      iUserManager_User: this.Info?.Id,

      strSession: this.Info?.session,
    };

    this.accountService.Dyar_BookmarkList(model).subscribe((response) => {
      this.posts = JSON.parse(response.toString());

      this.list_bookmark = JSON.parse(response.toString());

      if (this.mobileUser) {
        this.posts = this.posts.map((post) => {
          if (post.strText1?.length > 20) {
            post.strText1 = post.strText1.slice(0, 30) + '...';
          }

          return post;
        });

        this.list_bookmark = this.posts;
      }
    });
  }

  getRecentVisits() {
    var model = {
      iUserManager_User: this.Info?.Id,

      strSession: this.Info?.session,
    };

    this.accountService.Dyar_RecentVisits(model).subscribe((response) => {
      this.posts = JSON.parse(response.toString());

      if (this.posts.bError)
        return this.accountService.toastSwal(
          'error',
          this.posts.strError + ' Recent-Visits '
        );

      this.list_bookmark = JSON.parse(response.toString());

      if (this.mobileUser) {
        this.posts = this.posts?.map((post) => {
          if (post.strText1?.length > 20) {
            post.strText1 = post.strText1.slice(0, 30) + '...';
          }

          return post;
        });

        this.list_bookmark = this.posts;
      }
    });
  }

  getRecentVisitsBusiness() {
    var model = {
      iUserManager_User: this.Info?.Id,

      strSession: this.Info?.session,
    };

    this.accountService
      .Dyar_RecentVisits_Resume(model)
      .subscribe((response) => {
        this.posts = JSON.parse(response.toString());

        if (this.posts.bError)
          return this.accountService.toastSwal(
            'error',
            this.posts.strError + ' Recent-Visits '
          );

        this.list_bookmark = JSON.parse(response.toString());

        if (this.mobileUser) {
          this.posts = this.posts?.map((post) => {
            if (post.strText1?.length > 20) {
              post.strText1 = post.strText1.slice(0, 30) + '...';
            }

            return post;
          });

          this.list_bookmark = this.posts;
        }
      });
  }

  getRecentLikedBusiness() {
    var model = {
      iUserManager_User: this.Info?.Id,

      strSession: this.Info?.session,
    };

    this.accountService
      .Dyar_BookmarkList_Resume(model)
      .subscribe((response) => {
        this.posts = JSON.parse(response.toString());

        if (this.posts.bError)
          return this.accountService.toastSwal(
            'error',
            this.posts.strError + ' Recent-Visits '
          );

        this.list_bookmark = JSON.parse(response.toString());

        if (this.mobileUser) {
          this.posts = this.posts?.map((post) => {
            if (post.strText1?.length > 20) {
              post.strText1 = post.strText1.slice(0, 30) + '...';
            }

            return post;
          });

          this.list_bookmark = this.posts;
        }
      });
  }

  openDetail(item: any, index: number) {
    // only do iView++ when user is on home page

    // if (!this.isBookmark && !this.isRecentVisits)
    //   this.accountService.list_StoredAds[index].iView++;

    if (item.iAdvertising) {
      const url = `/dyar/ads/${item.iAdvertising}/${item.iMainKey}/${item.tiType}`;
      window.open(url, '_blank');
    } else {
      window.open(`dyar/business/${item.iUserManager_User}`, '_blank');
    }
  }

  changeRoute(path: string) {
    if (path == 'business') {
      window.open(`/dyar/${path}`, '_blank');
    } else {
      this.router.navigate([`/dyar/${path}`]);
    }
  }

  shareVia(item) {
    if (navigator.share) {
      navigator
        .share({
          url:
            window.location.origin +
            `/dyar/ads/${item.iAdvertising}/${item.iMainKey}/${item.tiType}`,

          title: item.strText1,
        })
        .then(() => console.log('اشتراک گذاری موفق'))

        .catch(() =>
          this.accountService.toastSwal('error', 'متاسفانه خطایی رخ داده است')
        );
    } else
      this.accountService.toastSwal(
        'error',
        'قابلیت اشتراک گذاری برای شما پشتیبانی نمی شود'
      );
  }

  bookmarkAds(item, index: number) {
    var model = {
      iUserManager_User: this.Info?.Id,

      strSession: this.Info?.session,

      iMainKey: item.iMainKey,

      tiType: item.tiType,
    };

    this.accountService.Dyar_Add_Remove_Bookmark(model).subscribe((data) => {
      let res = JSON.parse(data.toString());

      if (res.bError)
        return this.accountService.toastSwal('error', res.strError);

      if (item.bookMark == 0 || item.bookMark == 1)
        this.posts[index].bookMark = item.bookMark == 0 ? 1 : 0;
      else this.posts[index].bookMark = 0;
    });
  }

  getStrName(type: 'strCategory' | 'strCity') {
    if (type == 'strCategory') {
      const tiType = this.filterModel.get('tiType').value;

      return tiType == -1
        ? ` "همه دسته بندی ها" `
        : tiType == 0
          ? ` "سمساری" `
          : tiType == 1
            ? ` "همیاری شهروندی" `
            : tiType == 2
              ? ` "استخدام و کاریابی" `
              : tiType == 3
                ? ` "کسب و کارها" `
                : tiType == 4
                  ? ` "املاک" `
                  : '';
    }

    if (type == 'strCity') {
      const strCityCode = this.filterModel.get('strCityCode').value;

      if (strCityCode == -1) return `"همه شهر ها"`;

      const city_obj = this.list_City.find(
        (el: any) => el?.CityCode.trim() == strCityCode
      );

      if (city_obj) return `"${city_obj.strCityName.trim()}"`;
      else return '';
    }
  }

  searchIn_advertisements(form: NgForm) {
    var model = {
      ...form.value,

      strCityCode: this.otherService.get_defaultCity().strCityCode
        ? this.otherService.get_defaultCity().strCityCode
        : this.otherService.getLocalStorage().CityCode,
    };

    this.accountService.Advertising_List(model).subscribe((data) => {
      let res = JSON.parse(data.toString());

      if (res.bError)
        return this.accountService.toastSwal('error', res.strError);

      if (!res.length) return this.toastr.warning('موردی یافت نشد');
      // if (!res.length) return this.accountService.toastSwal('Warning', 'موردی یافت نشد');

      this.posts = res;

      this.filterModel.controls['tiType'].setValue(model.tiType);

      this.accountService.tiType_Stored = model.tiType;

      this.accountService.list_StoredAds = res;

      this.router.navigate([`/dyar/search/${model.tiType}`]);
    });
  }

  subString_Title(text: string) {
    if (text?.length > 60) text = text.slice(0, 60) + '...';

    return text;
  }

}
