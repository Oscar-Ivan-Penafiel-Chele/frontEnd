import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatisticsPurchaseRoutingModule } from './statistics-purchase-routing.module';
import { StatisticsPurchaseComponent } from './page/statistics-purchase.component';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    StatisticsPurchaseComponent
  ],
  imports: [
    CommonModule,
    StatisticsPurchaseRoutingModule,
    PrimengComponentsModule,
    FormsModule
  ]
})
export class StatisticsPurchaseModule { }
