import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatisticsSailRoutingModule } from './statistics-sail-routing.module';
import { StatisticsSailComponent } from './page/statistics-sail.component';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';
import { FormsModule } from '@angular/forms';
import { PruebaPdfComponent } from './components/pdf-prueba/prueba-pdf.component';


@NgModule({
  declarations: [
    StatisticsSailComponent,
    PruebaPdfComponent
  ],
  imports: [
    CommonModule,
    StatisticsSailRoutingModule,
    PrimengComponentsModule,
    FormsModule
  ]
})
export class StatisticsSailModule { }
