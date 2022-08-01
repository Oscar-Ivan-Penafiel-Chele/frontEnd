import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './page/payment.component';
import { PaymentRoutingModule } from './payment-routing.module';
import { FormsModule } from '@angular/forms';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';
import { OverlayRequestModule } from 'src/app/shared/components/overlay_request/overlay-request.module';

@NgModule({
  declarations: [
    PaymentComponent
  ],
  imports: [
    CommonModule,
    PaymentRoutingModule,
    FormsModule,
    PrimengComponentsModule,
    OverlayRequestModule
  ]
})
export class PaymentModule { }
