import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { OtherService } from 'src/app/services/other.service';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css'],
})
export class SupportComponent implements OnInit {
  Info: any;
  posts: any;
  helpTxt: any;
  pastData: any;
  answers: any;
  groups: any;
  showPosts: boolean = true;

  reqModel: FormGroup = this.formBuilder.group({
    tiTiketSubject: new FormControl(-1),
    strDetail: new FormControl(''),
    strCitizenAnswer: new FormControl(''),
  });

  constructor(
    private otherService: OtherService,

    private toastr: ToastrService,

    private dialog: MatDialog,

    private formBuilder: FormBuilder,

    private accountService: AccountService,

    private router: Router,

    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.Info = this.otherService.getLocalStorage();

    this.getHelp(6);
    this.getBaseData();
  }
  getBaseData() {
    var model = {
      iUserManager_User: this.Info.Id,
      strSession: this.Info.session,
    };

    this.accountService.getTiketList(model).subscribe((response) => {
      let res = JSON.parse(response.toString());
      this.posts = res;
      // console.log(res);
      
    });
    this.accountService.getTiketSubjects(model).subscribe((response) => {
      let res = JSON.parse(response.toString());
      this.groups = res;
    });
  }
  getHelp(e) {
    this.accountService.dyarHelp(e).subscribe((response) => {
      this.helpTxt = response.toString();
    });
  }
  openTiket(item) {
    var myModal = new bootstrap.Modal(document.getElementById('gallery'), {});
    myModal.show();
    var model = {
      iUserManager_User: this.Info.Id,
      strSession: this.Info.session,
      iTiket: item.iTiket,
    };

    this.pastData = item;
    this.accountService.getTiketAnswers(model).subscribe((response) => {
      let res = JSON.parse(response.toString());
      this.answers = res;
    });
  }
  closeModal() {
    let myModal = document.getElementById('gallery');

    var modal = bootstrap.Modal.getInstance(myModal);

    modal.hide();
  }
  changeMode() {
    this.showPosts = !this.showPosts;
  }
  submitPost() {
    let model = this.reqModel.value;
    model.iUserManager_User = this.Info.Id;
    model.strSession = this.Info.session;

    if (model.tiTiketSubject == '' || model.strDetail == '') {
      Swal.fire({
        title: 'لطفا موارد ستاره دار را وارد نمایید',
        icon: 'error',
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: 'تایید',
      });
    } else {
      Swal.fire({
        title: 'آیا از ثبت این مورد اطمینان دارید؟',
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
        reverseButtons: true,
        confirmButtonColor: '#10b981',
        confirmButtonText: 'تایید',
        cancelButtonText: 'لغو',
      }).then((result) => {
        if (result.isConfirmed) {
          this.accountService.saveTiket(model).subscribe((response) => {
            let res = JSON.parse(response.toString());

            if (res.bError == true) {
              Swal.fire({
                title: res.strError,
                icon: 'error',
                showCancelButton: true,
                showConfirmButton: false,
                cancelButtonText: 'تایید',
              });
            } else {
              Swal.fire({
                title: 'با موفقیت ثبت شد',
                icon: 'success',
                showCancelButton: true,
                showConfirmButton: false,
                cancelButtonText: 'تایید',
              });
              this.getBaseData();
              this.changeMode();
            }
          });
        }
      });
    }
  }

  deletePost(item) {
    Swal.fire({
      title: 'آیا از حذف این گزینه اطمینان دارید؟',
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
      reverseButtons: true,
      confirmButtonColor: '#10b981',
      confirmButtonText: 'تایید',
      cancelButtonText: 'لغو',
    }).then((result) => {
      if (result.isConfirmed) {
        var model = {
          iUserManager_User: this.Info.Id,

          strSession: this.Info.session,

          iTiket: item,
        };
        this.accountService.deleteTiket(model).subscribe((response: any) => {
          let res = JSON.parse(response);

          if (res.bError == true) {
            Swal.fire({
              title: 'خطا',
              icon: 'error',
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonText: 'تایید',
            });
          } else {
            Swal.fire({
              title: 'با موفقیت حذف شد',
              icon: 'success',
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonText: 'تایید',
            });
            this.getBaseData();
            this.closeModal();
          }
        });
      }
    });
  }

  sendText(e) {
    let model = this.reqModel.value;
    model.iUserManager_User = this.Info.Id;
    model.strSession = this.Info.session;
    model.iTiket = e.iTiket;


    if (model.strCitizenAnswer == "") {
      this.toastr.error('متن پیام را وارد کنید');
    } else {
      this.accountService.sendTiketActionUser(model).subscribe((response) => {
        let res = JSON.parse(response.toString());
        this.reqModel.controls['strCitizenAnswer'].setValue("");
  
        this.accountService.getTiketAnswers(model).subscribe((response) => {
          let res = JSON.parse(response.toString());
          this.answers = res;
        });
      });
    }
  
  }

}
