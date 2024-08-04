import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { OtherService } from 'src/app/services/other.service';

import { GuidModalComponent } from '../guidModal/guidModal.component';

import { MatDialog } from '@angular/material/dialog';

import { AccountService } from 'src/app/services/account.service';

import Swal from 'sweetalert2';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { MapDialog } from '../mapDialog/mapDialog.Component';

import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  pluck,
} from 'rxjs';

import { ajax } from 'rxjs/ajax';

import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

declare var bootstrap: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  posts: any;
  allPosts: any;
  minPrice = 0
  maxPrice = 0

  reqModel: FormGroup = this.formBuilder.group({
    fMaxPrice: new FormControl(''),
    fMinPrice: new FormControl(''),
    // strCityCode: new FormControl(''),
    tiOperator: new FormControl(-1),
    tiStatus: new FormControl(-1),
    tiType: new FormControl(-1),
    strPreNumber: new FormControl(-1),
  });
  @ViewChild('budget', { static: false }) budget!: ElementRef<
    HTMLInputElement | any
  >;
  @ViewChild('budgetND', { static: false }) budgetND!: ElementRef<
    HTMLInputElement | any
  >;

  otpForm: FormGroup;

  constructor(
    private otherService: OtherService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.otpForm = new FormGroup({
      digit1: new FormControl('', Validators.required),
      digit2: new FormControl('', Validators.required),
      digit3: new FormControl('', Validators.required),
      digit4: new FormControl('', Validators.required),
      digit5: new FormControl('', Validators.required),
      digit6: new FormControl('', Validators.required),
      digit7: new FormControl('', Validators.required),
    });
  }
  ngOnInit(): void {
    this.getPosts();
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
  }
  search() {
    this.posts = this.allPosts;


    this.otpForm.value.digit7 = this.otpForm.value.digit7 == "" ? "?" : this.otpForm.value.digit7;
    this.otpForm.value.digit6 = this.otpForm.value.digit6 == "" ? "?" : this.otpForm.value.digit6;
    this.otpForm.value.digit5 = this.otpForm.value.digit5 == "" ? "?" : this.otpForm.value.digit5;
    this.otpForm.value.digit4 = this.otpForm.value.digit4 == "" ? "?" : this.otpForm.value.digit4;
    this.otpForm.value.digit3 = this.otpForm.value.digit3 == "" ? "?" : this.otpForm.value.digit3;
    this.otpForm.value.digit2 = this.otpForm.value.digit2 == "" ? "?" : this.otpForm.value.digit2;
    this.otpForm.value.digit1 = this.otpForm.value.digit1 == "" ? "?" : this.otpForm.value.digit1;

    const otp =
      this.otpForm.value.digit7 +
      this.otpForm.value.digit6 +
      this.otpForm.value.digit5 +
      this.otpForm.value.digit4 +
      this.otpForm.value.digit3 +
      this.otpForm.value.digit2 +
      this.otpForm.value.digit1;
    console.log(otp);

    let pre = this.reqModel.value.strPreNumber
console.log(pre);

    if (pre == -1) {
      pre 
      = '????'
    }

    // this.reqModel.value.strMobile = pre + otp
    // console.log(this.reqModel.value.strMobile);


    const pattern = pre + otp;
console.log(pattern);

    const regexPattern = pattern.replace(/\?/g, '.');
    
    const regex = new RegExp(`^${regexPattern}$`);
    
    const filteredPosts1 = this.posts.filter(post => regex.test(post.strMobile));
    
    console.log(filteredPosts1);

    this.posts = filteredPosts1

// filter by fileds

let pMax = this.reqModel.value.fMaxPrice
let pMin = this.reqModel.value.fMinPrice

    const filters = this.reqModel.value;

    delete filters.fMaxPrice;
    delete filters.fMinPrice;
    delete filters.strMobile;
    
    if (filters.tiOperator == '-1') {
      filters.tiOperator = -1;
    }
    if (filters.tiStatus == '-1') {
      filters.tiStatus = -1;
    }
    if (filters.tiType == '-1') {
      filters.tiType = -1;
    }
    if (filters.strPreNumber == '-1') {
      filters.strPreNumber = -1;
    }

    function filterPosts(posts, filters) {
      return posts.filter((post) => {

        return Object.keys(filters).every((field) => {
          const filterValue = filters[field];

          if (filterValue !== -1) {
            return post[field] === filterValue;
          }
          return true; 
        });
      });
    }

    // filter by price
    if (pMin == "" || pMin == undefined) {
      pMin = this.minPrice
    }
    if (pMax == "" || pMax == undefined) {
      pMax = this.maxPrice
    }
    
    this.posts = this.posts.filter(post => {
      return post.iPrice >= pMin && post.iPrice <= pMax;
    });

    // Usage
    const filteredPosts = filterPosts(this.posts, filters);
    this.posts = filteredPosts;
    this.onSubmit();
  }
  getPosts() {
    this.http.get('assets/numbers.json').subscribe((data) => {
      this.posts = data;
      this.allPosts = data;
      for (let index = 0; index < this.allPosts?.length; index++) {
        const element = this.allPosts[index];
        if (element.iPrice > this.maxPrice) this.maxPrice = element.iPrice 
        if (element.iPrice < this.minPrice) this.minPrice = element.iPrice 
      }
    });
  }

  onSubmit() {

    
    // Process the OTP here (e.g., send it to the server for verification)
  }

  sortColumn(input) {
    this.posts.sort((x, y) => {
      switch (input) {
        case 0:
          var textA = x.iPrice.toUpperCase();
          var textB = y.iPrice.toUpperCase();
          break;
       
      }
      if (textA > textB)
        return (textA < textB) ? 1 : (textA > textB) ? -1 : 0;
      if (textA < textB)
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      return
    });
  }


  // This function is optional and can be used to automatically focus the next input field when the current one is filled
  onInputKeyUp(event: any, index: number) {
    const numericValue = parseInt(event.target.value, 10);
    if (!isNaN(numericValue)) {
      if (numericValue >= 0 && numericValue <= 9) {
        if (event.target.previousElementSibling) {
          event.target.previousElementSibling.focus();
        }
      }
    }
  }
}
