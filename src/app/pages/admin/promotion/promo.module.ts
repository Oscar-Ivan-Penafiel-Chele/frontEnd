import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromoRoutingModule } from './promo-routing.module';
import { PromoComponent } from './page/promo.component';
import { FormsModule } from '@angular/forms';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';

@NgModule({
  declarations: [
    PromoComponent
  ],
  imports: [
    CommonModule,
    PromoRoutingModule,
    FormsModule,
    PrimengComponentsModule
  ]
})
export class PromoModule { }
