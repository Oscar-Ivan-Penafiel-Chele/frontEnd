import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';

import { AboutComponent } from './about.component';
// import { ScrollToUpComponent } from 'src/app/components/scroll-to-up/scroll-to-up.component';



@NgModule({
  declarations: [
    AboutComponent,
    // ScrollToUpComponent
  ],
  imports: [
    CommonModule,
    AboutRoutingModule
  ]
})

export class AboutModule { }
