import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationComponent } from './page/confirmation.component';
import { ConfirmationRoutingModule } from './confirmation-routing.module';
import {InputTextModule} from 'primeng/inputtext';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {InputMaskModule} from 'primeng/inputmask';
import { FormsModule } from '@angular/forms';
import {CheckboxModule} from 'primeng/checkbox';
import { NgxPayPalModule } from 'ngx-paypal';
import {ToastModule} from 'primeng/toast';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';

@NgModule({
  declarations: [
    ConfirmationComponent
  ],
  imports: [
    CommonModule,
    ConfirmationRoutingModule,
    InputTextModule,
    CardModule,
    ButtonModule,
    InputMaskModule,
    FormsModule,
    CheckboxModule,
    NgxPayPalModule,
    ToastModule,
    ProgressSpinnerModule,
    MessagesModule,
    MessageModule
  ]
})
export class ConfirmationModule { }
