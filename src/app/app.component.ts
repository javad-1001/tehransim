import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { BusyService } from './services/busy.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'shahrnik';

  @HostListener('click') onClick() {

    // window.alert('Current DOM element is');

    // var el = document.getElementsByTagName('body') as any;

    // var modal = document.querySelectorAll('.show') as any;



  }



}
