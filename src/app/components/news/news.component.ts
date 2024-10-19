import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { OtherService } from 'src/app/services/other.service';

import { GuidModalComponent } from '../guidModal/guidModal.component';

import { MatDialog } from '@angular/material/dialog';

import { AccountService } from 'src/app/services/account.service';

import Swal from 'sweetalert2';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { MapDialog } from '../mapDialog/mapDialog.Component';

import { DatePipe } from '@angular/common';

import { MAT_DATE_FORMATS } from '@angular/material/core';


declare var bootstrap: any;
@Component({

  selector: 'app-news',

  templateUrl: './news.component.html',

  styleUrls: ['./news.component.css'],

})

export class NewsComponent implements OnInit {

  Info: any;

  news: any;

  newsDetail: any;

  modeRead: boolean = false;

  constructor(

    private otherService: OtherService,

    private toastr: ToastrService,

    private dialog: MatDialog,

    private formBuilder: FormBuilder,

    private accountService: AccountService,

    private router: Router,

    private route: ActivatedRoute,

    private datePipe: DatePipe

  ) { }

  ngOnInit(): void {

    this.Info = this.otherService.getLocalStorage();

    this.route.url.subscribe((segment) => {

      const router = segment[0].path;

      this.modeRead = router == 'news' ? false : true;

      var model = {

        iJournal: segment[1].path,

      };

      this.accountService.getDyarJournalDetail(model).subscribe((response) => {

        let res = JSON.parse(response.toString());

        this.newsDetail = res[0];

      });

    });

    var model = {

      iUserManager_User: this.Info.Id,

      strSession: this.Info.session,

    };

    this.accountService.dyarNews(model).subscribe((response) => {

      this.news = JSON.parse(response.toString());

    });

  }


  openDetail(item: any, index: number) {

    window.open(`qrond/News/${item.iJournal}`);

  }

}
