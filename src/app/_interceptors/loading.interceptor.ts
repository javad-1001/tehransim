import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { BusyService } from '../services/busy.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(public loaderService: BusyService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // this.loaderService.isLoading.next(true);

    // return next.handle(request).pipe(
    //   finalize(()=> {
    //     this.loaderService.isLoading.next(false);
    //   })
    // )

    this.loaderService.busy();

    return next.handle(request).pipe(

      finalize(() => {

        this.loaderService.idle();

      }),

    )
    
  }
}
