import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateOrderComponent } from './page/create-order.component';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CreateOrderComponent
  ],
  imports: [
    CommonModule,
    PrimengComponentsModule,
    FormsModule
  ],
  exports: [
    CreateOrderComponent,
  ]
})
export class CreateOrderModule { }
