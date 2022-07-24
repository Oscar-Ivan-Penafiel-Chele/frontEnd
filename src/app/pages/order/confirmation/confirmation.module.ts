import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationComponent } from './page/confirmation.component';
import { ConfirmationRoutingModule } from './confirmation-routing.module';
import { FormsModule } from '@angular/forms';

import { NgxPayPalModule } from 'ngx-paypal';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';

@NgModule({
  declarations: [
    ConfirmationComponent
  ],
  imports: [
    CommonModule,
    ConfirmationRoutingModule,
    FormsModule,
    NgxPayPalModule,
    PrimengComponentsModule
  ]
})
export class ConfirmationModule { }
