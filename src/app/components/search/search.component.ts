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

import { debounceTime, distinctUntilChanged, fromEvent, pluck } from 'rxjs';

import { ajax } from 'rxjs/ajax';

import { environment } from 'src/environments/environment';

declare var bootstrap: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  reqModel: FormGroup = this.formBuilder.group({
    strTitle: new FormControl(''),
    strCityCode: new FormControl(-1),
    iSamsari_Group: new FormControl(-1),
    iSamsari_SubGroup: new FormControl(-1),
    tiSamsariCondiation: new FormControl(-1),
    strAddress: new FormControl(''),
    fPrice: new FormControl(''),
    bFree: new FormControl(false),
    bAgreement: new FormControl(false),
    bActive: new FormControl(true),
    fLat: new FormControl(),
    fLon: new FormControl(),
    strComment: new FormControl(),
    strSamsariMobile: new FormControl(),
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
    private route: ActivatedRoute
  ) {
    this.otpForm = new FormGroup({
      digit1: new FormControl('', Validators.required),
      digit2: new FormControl('', Validators.required),
      digit3: new FormControl('', Validators.required),
      digit4: new FormControl('', Validators.required),
      digit5: new FormControl('', Validators.required),
      digit6: new FormControl('', Validators.required),
      digit7: new FormControl('', Validators.required),
      // Add more digits if your OTP has more than 4 digits
    });
  }
  ngOnInit(): void {}
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

  onSubmit() {
    const otp =
      this.otpForm.value.digit1 +
      this.otpForm.value.digit2 +
      this.otpForm.value.digit3 +
      this.otpForm.value.digit4 +
      this.otpForm.value.digit5 +
      this.otpForm.value.digit6 +
      this.otpForm.value.digit7;
    console.log(otp);
    // Process the OTP here (e.g., send it to the server for verification)
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
