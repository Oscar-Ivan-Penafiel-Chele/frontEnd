import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EgresosComponent } from './page/egresos.component';
import { EgresosRoutingModule } from './egresos-routing.module';
import { FormsModule } from '@angular/forms';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';

@NgModule({
  declarations: [
    EgresosComponent
  ],
  imports: [
    CommonModule,
    EgresosRoutingModule,
    FormsModule,
    PrimengComponentsModule
  ]
})
export class EgresosModule { }
