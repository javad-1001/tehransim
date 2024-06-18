import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {

  busyRequestCount = 0;

  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(private spinnerService: NgxSpinnerService) { }


  busy() {

    this.busyRequestCount++;

    this.spinnerService.show(undefined, {

      type: 'square-jelly-box',

      bdColor: 'rgba(0,0,0,0.4)',

      color: '#FFAA01',

      size: 'medium',

      fullScreen: true,


    })
    
  }

  idle() {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.spinnerService.hide()
    }
  }
  
}

