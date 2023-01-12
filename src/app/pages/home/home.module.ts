import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './page/home.component';
import { HomeRoutingModule } from './home-routing.module';

import { RouterModule } from '@angular/router';
import { ButtonUpModule } from 'src/app/shared/components/button-up/button-up.module';
import { FooterModule } from 'src/app/shared/components/footer/footer.module';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';
import { NavigationHomeComponent } from './components/navigation-home/navigation-home.component';
import { ProductsHomeComponent } from './components/products-home/products-home.component';
import { CarouselHomeComponent } from './components/carousel-home/carousel-home.component';
import { ServiceHomeComponent } from './components/service-home/service-home.component';
import { DetailHomeComponent } from './components/detail-home/detail-home.component';

@NgModule({
  declarations: [
    HomeComponent,
    NavigationHomeComponent,
    ProductsHomeComponent,
    CarouselHomeComponent,
    ServiceHomeComponent,
    DetailHomeComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    RouterModule,
    ButtonUpModule,
    FooterModule,
    PrimengComponentsModule
  ]
})
export class HomeModule { }
