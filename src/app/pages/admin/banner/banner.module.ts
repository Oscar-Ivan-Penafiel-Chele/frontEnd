import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerRoutingModule } from './banner-routing.module';
import { BannerComponent } from './page/banner.component';
import { FormsModule } from '@angular/forms';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';

@NgModule({
  declarations: [
    BannerComponent
  ],
  imports: [
    CommonModule,
    BannerRoutingModule,
    FormsModule,
    PrimengComponentsModule
  ]
})
export class BannerModule { }
