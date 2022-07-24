import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngresosComponent } from './page/ingresos.component';
import { IngresosRoutingModule } from './ingresos-routing.module';
import { FormsModule } from '@angular/forms';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';

@NgModule({
  declarations: [
    IngresosComponent
  ],
  imports: [
    CommonModule,
    IngresosRoutingModule,
    FormsModule,
    PrimengComponentsModule
  ]
})
export class IngresosModule { }
