import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-guide-pages',
  templateUrl: './guide-pages.component.html',
  styleUrls: ['./guide-pages.component.css'],
})
export class GuidePagesComponent implements OnInit {
  htmlContent: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}
  getSafeHtml(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
  ngOnInit(): void {
    this.route.url.subscribe((segment) => {
      const router = segment[0].path;
      if (router === 'about') {
        this.fetchHTMLFile(1);
      }
      if (router === 'general') {
        this.fetchHTMLFile(2);
      }
    });
  }

  fetchHTMLFile(mode) {
    if (mode == 1) {
      this.http
        .get('../../../assets/basic/tehransim_About.html', { responseType: 'text' })
        .subscribe((data) => {
          this.htmlContent = data;
        });
    }
    if (mode == 2) {
      this.http
        .get('../../../assets/basic/tehransim_GeneralConditions.html', {
          responseType: 'text',
        })
        .subscribe((data) => {
          this.htmlContent = data;
        });
    }
  }
}
