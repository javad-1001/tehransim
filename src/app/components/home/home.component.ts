import { HttpClient } from '@angular/common/http';

import { Component, OnInit } from '@angular/core';

import { NgForm } from '@angular/forms';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { ActivatedRoute, Router } from '@angular/router';

import { OwlOptions } from 'ngx-owl-carousel-o';

import { ToastrService } from 'ngx-toastr';

import { AccountService } from 'src/app/services/account.service';

import { OtherService } from 'src/app/services/other.service';


@Component({

  selector: 'app-home',

  templateUrl: './home.component.html',

  styleUrls: ['./home.component.css'],

})

export class HomeComponent implements OnInit {

  slider: any;

  sliderVIPst: any;

  sliderVIPnd: any;

  sliderNEWst: any;

  sliderNEWnd: any;

  sliderVIP: any;

  sliderNEW: any;

  news: any;

  cities: any;

  ability: any;

  htmlContent: any;

  htmlContentNd: any;

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

  carouselOptions4city = {
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
        items: 2,
      },
      768: {
        items: 3,
      },
      992: {
        items: 6,
      },
    },
  };

  carouselOptions4News = {
    items: 1,
    rtl: true,
    loop: true,
    autoplay: true,
    autoplayTimeout: 3000, // Adjust the autoplay timeout as needed
    autoplayHoverPause: true,
    dots: false,
    margin: 20,
    nav: false, // Set to true if you want navigation arrows
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 1,
      },
      992: {
        items: 3,
      },
    },
  };

  constructor(
    private accountService: AccountService,
    private router: Router,
    private otherService: OtherService,
    private toastr: ToastrService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {

    this.otherService.getAppAbility().subscribe((data) => {

      this.ability = data;

    });

    this.accountService.getAllProducts().subscribe((data) => {
      // let res = JSON.parse(data.toString());
      console.log(data);
      
    });

    this.getBaseData();

    this.getAds();
  }

  getAds() {
    this.http
      .get('../../../assets/basic/Ads_home_first.html', {
        responseType: 'text',
      })
      .subscribe((data) => {
        this.htmlContent = data;
      });
    this.http
      .get('../../../assets/basic/Ads_home_second.html', {
        responseType: 'text',
      })
      .subscribe((data) => {
        this.htmlContentNd = data;
      });
  }

  getSafeHtml(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

  getBaseData() {

    var model = {
      iUserManager_User: 0,
      strCity: '',
      strCityCode: '',
      strSession: '',
      strTitle: '',
      tiType: -1,
      bVIP: true,
    };

    var modelnew = {
      iUserManager_User: 0,
      strCity: '',
      strCityCode: '',
      strSession: '',
      strTitle: '',
      tiType: -1,
      bNew: true,
    };

    this.accountService.getAllProducts().subscribe((response) => {
      this.sliderVIP = response;

      // this.sliderVIP = this.sliderVIP.slice(0, 12);

    
    });

    this.accountService.adsList(modelnew).subscribe((response) => {
      let res = JSON.parse(response.toString());

      let length = res.length;

      this.sliderNEW = res;

      // this.sliderNEW = this.sliderNEW.slice(0, 12);

      this.sliderNEWst = res.slice(0, length / 2);

      this.sliderNEWnd = res.slice(length / 2);
    });

    if (this.accountService.list_StoredNews.length == 0) {

      this.accountService.dyarNews(model).subscribe((response) => {

        this.news = JSON.parse(response.toString());

        this.accountService.list_StoredNews = this.news;

      });

    }

    if (this.accountService.list_StoredNews.length != 0) {

      this.news = this.accountService.list_StoredNews;

    }

    if (this.accountService.list_StoredCity_By_Image.length == 0) {

      this.accountService.DyarCityListByImage().subscribe((data) => {

        let res = JSON.parse(data.toString());

        this.cities = res;

        this.accountService.list_StoredCity_By_Image = res;

      });
    }

    if (this.accountService.list_StoredCity_By_Image.length != 0) {

      this.cities = this.accountService.list_StoredCity_By_Image;

    }

  }

  openDetail(item: any, index: number) {
    window.open(
      `dyar/ads/${item.iAdvertising}/${item.iMainKey}/${item.tiType}`,
      '_blank'
    );
  }

  openSearch(tiType: number, item?: any) {
    if (item) {
      var selectedCity = {
        strCityCode: item.CityCode.trim(),

        strCityName: item.strCityName.trim(),
      };

      localStorage.removeItem('dc30al1i7rez0ab02');

      localStorage.setItem(
        'dc30al1i7rez0ab02',
        this.accountService.encrypt(JSON.stringify(selectedCity))
      );

      this.otherService.changeUserSelectedCity_Status(true);
    }

    if (tiType == 3) return this.router.navigate([`dyar/business`]);

    this.accountService.list_StoredAds = [];

    this.router.navigate([`dyar/search/${tiType}`]);
  }

  reDirect(url) {
    this.router.navigate([`dyar/${url}`]);
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

      this.accountService.tiType_Stored = model.tiType;

      this.accountService.list_StoredAds = res;

      this.router.navigate([`/dyar/search/${model.tiType}`]);
    });
  }

  subString_Title(text: string, limit?: number) {
    if (limit && text?.length > limit) text = text.slice(0, limit) + '...';

    if (!limit && text?.length > 55) text = text.slice(0, 55) + '...';

    return text;
  }

}
