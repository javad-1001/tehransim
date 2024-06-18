import { Component, OnInit } from '@angular/core';
import {
  AnyForUntypedForms,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { OtherService } from 'src/app/services/other.service';
import { Location } from '@angular/common';
import { MapDialog } from '../mapDialog/mapDialog.Component';

declare var bootstrap: any;

@Component({
  selector: 'app-business-chat',
  templateUrl: './business-chat.component.html',
  styleUrls: ['./business-chat.component.css'],
})
export class BusinessChatComponent implements OnInit {
  chat: any;
  chats: any;
  Info: any;
  PMs: any;
  userInfo: any;
  locations: any;
  selectedPic: any;
  address: any;

  showChats: boolean = true;
  showSend: boolean = false;

  pmSender: FormGroup = this.formBuilder.group({
    iMesType: new FormControl(0),
    strMessage: new FormControl(''),
    strMessageImage: new FormControl(''),
    fLon: new FormControl(0),
    fLat: new FormControl(0),
  });

  constructor(
    public route: ActivatedRoute,
    private location: Location,
    private toastr: ToastrService,
    private router: Router,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private otherService: OtherService
  ) {
    // this.chat = this.router.getCurrentNavigation().extras.state;
  }

  ngOnInit(): void {
    this.Info = this.otherService.getLocalStorage();
    this.locations = [this.Info?.fLon, this.Info?.fLat];
    this.getChats();
  }
  getChats() {
    var model = {
      iUserManager_Me: this.Info?.Id,
      strSession: this.Info?.session,
    };
    this.accountService.getAllChats(model).subscribe((response) => {
      this.chats = JSON.parse(response.toString());
      // console.log(this.chats);
    });
  }
  goBack(): void {
    this.location.back();
  }
  goChat(): void {
    this.showChats = true;
  }
  voice(pm) {
    // console.log(pm);
    const audioPlayer = document.getElementById(
      'audioPlayer'
    ) as HTMLAudioElement;
    const base64Audio = pm.strImageOrWave;
    const decodedData = atob(base64Audio)
      .split('')
      .map((char) => char.charCodeAt(0));
    const arrayBuffer = new Uint8Array(decodedData).buffer;
    const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
    audioPlayer.src = URL.createObjectURL(blob);
  }
  base64ToAudioUrl(base64String: string): string {
    return 'data:audio/mp3;base64,' + base64String; // Adjust the type based on your audio format
  }
  openMapInNewTab(lat: number, lon: number): void {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
    window.open(url, '_blank');
  }
  checkInput(e) {
    if (e.length !== 0) {
      this.showSend = true;
    } else {
      this.showSend = false;
    }
  }
  openChat(item) {
    var model = {
      iUserManager_User_Sender: this.Info?.Id,
      strSession: this.Info?.session,
      iUserManager_User_Receivier: item.iUserManager_User_His,
    };
    this.userInfo = item;
    this.showChats = false;

    this.accountService.getChatList(model).subscribe((response) => {
      this.PMs = JSON.parse(response.toString());
      // console.log(this.PMs);
      this.scrollChatToBottom();
    });

  }
  scrollChatToBottom() {
    setTimeout(function() {
      var chatbox = document.getElementById("chatbox");
      chatbox.scrollTop = chatbox.scrollHeight;
    }, 1000); // 3000 milliseconds = 3 seconds
  }
  onPicSelected(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.selectedPic = reader.result as string;
      let parts = this.selectedPic.split(',');
      let header = parts[0];
      let data = parts[1];
      this.selectedPic = data;
    };
  }

  openPicModal() {
    var myModal = new bootstrap.Modal(document.getElementById('Modal'), {});
    myModal.show();
  }

  closeModal() {
    let myModal = document.getElementById('Modal');
    var modal = bootstrap.Modal.getInstance(myModal);
    modal.hide();
  }

  sendText(mode) {
    if (mode == 0) {
      let model = this.pmSender.value;
      (model.iUserManager_User_Sender = this.Info?.Id),
        (model.strSession = this.Info?.session),
        (model.iUserManager_User_Receivier =
          this.userInfo.iUserManager_User_His),
        // console.log(model);

      this.accountService.sendChat(model).subscribe((response) => {
        this.openChat(this.userInfo);
        this.pmSender.controls['strMessage'].setValue('');
        this.showSend = true;
      });
    }
    if (mode == 1) {
      let model = this.pmSender.value;
      (model.iUserManager_User_Sender = this.Info?.Id),
        (model.strSession = this.Info?.session),
        (model.strMessageImage = this.selectedPic),
        (model.iMesType = 1),
        (model.iUserManager_User_Receivier =
          this.userInfo.iUserManager_User_His),
        // console.log(model);

      this.accountService.sendChat(model).subscribe((response) => {
        this.openChat(this.userInfo);
        this.pmSender.controls['strMessage'].setValue('');
        this.closeModal();
      });
    }
    if (mode == 2) {
      let model = this.pmSender.value;
      (model.iUserManager_User_Sender = this.Info?.Id),
        (model.strSession = this.Info?.session),
        (model.strMessageImage = this.selectedPic),
        (model.iMesType = 2),
        (model.iUserManager_User_Receivier =
          this.userInfo.iUserManager_User_His),
        // console.log(model);

      this.accountService.sendChat(model).subscribe((response) => {
        this.openChat(this.userInfo);
        this.pmSender.controls['strMessage'].setValue('');
      });
    }
  }

  map() {
    let dialogRef = this.dialog.open(MapDialog, {
      width: '95%',
      data: this.locations,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.pmSender.controls['fLon'].setValue(res.data[0]);
        this.pmSender.controls['fLat'].setValue(res.data[1]);
        this.locations[0] = res.data[0];
        this.locations[1] = res.data[1];
        this.accountService
          .ReverseGeocoding(res.data[0], res.data[1])
          .subscribe((response) => {
            let resp = JSON.stringify(response);
            let resPars = JSON.parse(resp);
            if (resPars.Result == 1) {
              this.address = resPars.strAddress;
              this.pmSender.controls['strMessage'].setValue(resPars.strAddress);
              // console.log(this.pmSender.value);
              this.sendText(2);
            }
            if (resPars.Result == -1) {
              this.toastr.error(resPars.strAddress);
              this.address = resPars.strAddress;
            }
          });
      }
    });
  }
}
