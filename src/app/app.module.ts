import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegisterPageComponent } from './components/register-panel/register-panel.component';
import { MapPageComponent } from './components/map-page/map-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NgxPersianModule } from 'ngx-persian';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { LoadingInterceptor } from './_interceptors/loading.interceptor';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MapService } from './services/map.service';
import { OtherService } from './services/other.service';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { NgPersianDatepickerModule } from 'ng-persian-datepicker';
import { AudioRecordingService } from './services/audio-recording.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
// import { GurdServiceService } from './services/gurd-service.service';
import { GurdServiceService } from './Services/gurd-service.service';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { GuidModalComponent } from './components/guidModal/guidModal.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MapDialog } from './components/mapDialog/mapDialog.Component';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad';
import { BusinessMainComponent } from './components/business-main/business-main.component';
import { BusinessDetailComponent } from './components/business-detail/business-detail.component';
import { BusinessChatComponent } from './components/business-chat/business-chat.component';
import { DiarMainComponent } from './components/diar-main/diar-main.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { SupportComponent } from './components/support/support.component';
import { HomeComponent } from './components/home/home.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { GuidePagesComponent } from './components/guide-pages/guide-pages.component';
import { NewsComponent } from './components/news/news.component';
import { SearchComponent } from './components/search/search.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    LandingPageComponent,
    DashboardComponent,
    RegisterPageComponent,
    MapPageComponent,
 
    GuidModalComponent,
    MapDialog,
 
    BusinessMainComponent,
    BusinessDetailComponent,
    BusinessChatComponent,
    DiarMainComponent,
    SupportComponent,
    HomeComponent,
    GuidePagesComponent,
    NewsComponent,
    SearchComponent,
    // CarouselHolderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CarouselModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    NgxStarRatingModule,
    AngularSignaturePadModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),

    NgxPersianModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      easing: 'slide-in',
      timeOut: 3000,
      preventDuplicates: true
    }),
    NgPersianDatepickerModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    NgxMaterialTimepickerModule,
    MatIconModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatDialogModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatRadioModule,
    MatListModule,
    MatBottomSheetModule,
    MatCheckboxModule,

    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    MatSnackBarModule,
    NgbModule,

  ],
  schemas: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }, MapService, DatePipe,OtherService, AudioRecordingService, GurdServiceService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }