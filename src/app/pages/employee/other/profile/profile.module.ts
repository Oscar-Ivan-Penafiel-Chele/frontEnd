import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import {CardModule} from 'primeng/card';
import {RippleModule} from 'primeng/ripple';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import { FormsModule } from '@angular/forms';
import {InputMaskModule} from 'primeng/inputmask';
import {DialogModule} from 'primeng/dialog';
import {PasswordModule} from 'primeng/password';
import {SkeletonModule} from 'primeng/skeleton';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    CardModule,
    RippleModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    InputMaskModule,
    DialogModule,
    PasswordModule,
    SkeletonModule,
    ReactiveFormsModule,
  ]
})
export class ProfileModule { }
