import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './page/home.component';
import { HomeRoutingModule } from './home-routing.module';

import { RouterModule } from '@angular/router';
import { ButtonUpModule } from 'src/app/shared/components/button-up/button-up.module';
import { FooterModule } from 'src/app/shared/components/footer/footer.module';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';

@NgModule({
  declarations: [
    HomeComponent,
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
