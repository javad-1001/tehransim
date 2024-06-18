import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { GurdGuard } from './gurd.guard';


import { BusinessMainComponent } from './components/business-main/business-main.component';


import { BusinessDetailComponent } from './components/business-detail/business-detail.component';


import { BusinessChatComponent } from './components/business-chat/business-chat.component';

import { DiarMainComponent } from './components/diar-main/diar-main.component';

import { LandingPageComponent } from './components/landing-page/landing-page.component';




import { SupportComponent } from './components/support/support.component';

import { HomeComponent } from './components/home/home.component';



import { GuidePagesComponent } from './components/guide-pages/guide-pages.component';



import { NewsComponent } from './components/news/news.component';




const routes: Routes = [

  { path: '', redirectTo: 'dyar/home', pathMatch: 'full' },

  { path: 'dyar', redirectTo: 'dyar/home', pathMatch: 'full' },


  {
    path: 'dyar', component: LandingPageComponent, children: [

      { path: 'search', component: BusinessMainComponent },

      { path: 'search/:tiType', component: BusinessMainComponent },


      { path: 'home', component: HomeComponent },

      { path: 'bookmarks', component: BusinessMainComponent },
      
      { path: 'business-bookmarks', component: BusinessMainComponent },

      { path: 'recent-visits', component: BusinessMainComponent },

      { path: 'business-recent-visits', component: BusinessMainComponent },

      { path: 'chat', component: BusinessChatComponent },



      { path: 'ads/:iAdvertising/:id/:type', component: BusinessDetailComponent },

      // { path: 'adsDetail/:iAdvertising/:id/:type', component: MyadsDetailComponent },

      { path: 'login/:redirectTo', component: BusinessDetailComponent },

      { path: 'login/:redirectTo/:id', component: BusinessDetailComponent },

      { path: 'BusinessDetail-myads', component: BusinessDetailComponent },


      { path: 'dyar', component: DiarMainComponent },

      { path: 'support', component: SupportComponent },
     
      { path: 'about', component: GuidePagesComponent },
      
      { path: 'general', component: GuidePagesComponent },

      { path: 'news', component: NewsComponent },
      
      { path: 'News/:id', component: NewsComponent },
      
    ]
  },

];

@NgModule({

  imports: [

    RouterModule.forRoot(routes),

  ],

  exports: [RouterModule]

})

export class AppRoutingModule { }
