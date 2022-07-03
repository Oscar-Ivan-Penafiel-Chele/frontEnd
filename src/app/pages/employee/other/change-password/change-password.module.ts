import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswordComponent } from './change-password.component';
import { ChangePasswordRoutingModule } from './change-password-routing.module';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {CardModule} from 'primeng/card';
import {PasswordModule} from 'primeng/password';
import { FormsModule } from '@angular/forms';
import {DividerModule} from 'primeng/divider';
import {ToastModule} from 'primeng/toast';
import { OverlayChangePasswordModule } from 'src/app/components/overlay-change-password/overlay-change-password.module';


@NgModule({
  declarations: [
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    ChangePasswordRoutingModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    CardModule,
    PasswordModule,
    FormsModule,
    DividerModule,
    ToastModule,
    OverlayChangePasswordModule
  ]
})
export class ChangePasswordModule { }
