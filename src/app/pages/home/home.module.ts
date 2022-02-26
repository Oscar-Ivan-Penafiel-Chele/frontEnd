import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import {CarouselModule} from 'primeng/carousel';
import { RouterModule } from '@angular/router';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
// import { ScrollToUpComponent } from 'src/app/components/scroll-to-up/scroll-to-up.component';

@NgModule({
  declarations: [
    HomeComponent,
    // ScrollToUpComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    CarouselModule,
    RouterModule,
    InputTextModule,
    ButtonModule,  
  ]
})
export class HomeModule { }
