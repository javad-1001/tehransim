import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { GurdServiceService } from './Services/gurd-service.service';

@Injectable({
  providedIn: 'root'
})
export class GurdGuard implements CanActivate {
  constructor(private Authguardservice: GurdServiceService, private router: Router) { }
  canActivate(): boolean {
    // if (!this.Authguardservice.gettoken()) {  
    //     this.router.navigateByUrl("/");  
    // }  
    // return this.Authguardservice.gettoken();  

    return true
  }
}
