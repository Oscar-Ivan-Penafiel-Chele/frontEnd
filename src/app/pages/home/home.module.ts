import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import {CarouselModule} from 'primeng/carousel';
import { RouterModule } from '@angular/router';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import { SharedModule } from '../shared/shared.module';
import {SkeletonModule} from 'primeng/skeleton';

@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    CarouselModule,
    RouterModule,
    InputTextModule,
    ButtonModule,  
    SharedModule,
    SkeletonModule
  ]
})
export class HomeModule { }
