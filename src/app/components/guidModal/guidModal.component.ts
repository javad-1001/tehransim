import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { BusyService } from 'src/app/services/busy.service';
import { OtherService } from 'src/app/services/other.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'guid',
  templateUrl: './guidModal.component.html',

})
export class GuidModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<GuidModalComponent>,
    @Inject(MAT_DIALOG_DATA) public task: any,
    private accountService: AccountService,
    private toastr: ToastrService,
    public loaderService: BusyService,
    private otherService: OtherService
  ) { }
  strGuid: any;
  ngOnInit(): void {
    this.closeModal()
    this.accountService.OnlineHelp(this.task).subscribe((response: any) => {
      this.strGuid = response;
      Swal.fire({
        title: this.strGuid,
        icon: 'question',
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: 'تایید',
  
      })
    })
  }
  closeModal() {
    this.dialogRef.close();
  }
}
