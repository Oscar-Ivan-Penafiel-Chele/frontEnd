import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order.component';
import { OrderRoutingModule } from './order-routing.module';
import { FooterModule } from 'src/app/shared/components/footer/footer.module';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';

@NgModule({
  declarations: [
    OrderComponent,
  ],
  imports: [
    CommonModule,
    OrderRoutingModule,
    FooterModule,
    PrimengComponentsModule
  ]
})
export class OrderModule { }
