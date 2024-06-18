import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-diar-main',
  templateUrl: './diar-main.component.html',
  styleUrls: ['./diar-main.component.css'],
})
export class DiarMainComponent implements OnInit {
  constructor(private router: Router, private location: Location) {}

  ngOnInit(): void {}
  openDetail(item) {
    this.router.navigate(['/home'], {
      state: { productdetails: item },
    });
  }
}
