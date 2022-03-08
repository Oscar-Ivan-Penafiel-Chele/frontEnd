import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {KeyFilterModule} from 'primeng/keyfilter';
import {DropdownModule} from 'primeng/dropdown';
import {PasswordModule} from 'primeng/password';
import {DividerModule} from 'primeng/divider';
import {CheckboxModule} from 'primeng/checkbox';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {InputMaskModule} from 'primeng/inputmask';
import {ToastModule} from 'primeng/toast';

@NgModule({
  declarations: [
    SignupComponent,
  ],
  imports: [
    CommonModule,
    SignupRoutingModule,
    MessagesModule,
    MessageModule,
    FormsModule,
    ReactiveFormsModule,
    KeyFilterModule,
    DropdownModule,
    PasswordModule,
    DividerModule,
    CheckboxModule,
    ButtonModule,
    InputTextModule,
    InputMaskModule,
    ToastModule
  ]
})
export class SignupModule { }
