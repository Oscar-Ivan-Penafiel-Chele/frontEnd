import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesmanComponent } from './page/salesman.component';
import { SalesmanRoutingModule } from './salesman-routing.module';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';

@NgModule({
  declarations: [
    SalesmanComponent,
  ],
  imports: [
    CommonModule,
    SalesmanRoutingModule,
    PrimengComponentsModule
  ]
})
export class SalesmanModule { }
