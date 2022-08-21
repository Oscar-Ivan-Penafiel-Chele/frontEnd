import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './page/signup.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {IMaskModule} from 'angular-imask';
import { BackgroundAnimateModule } from 'src/app/shared/components/background-animate/background-animate.module';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';

@NgModule({
  declarations: [
    SignupComponent,
  ],
  imports: [
    CommonModule,
    SignupRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    IMaskModule,
    BackgroundAnimateModule,
    PrimengComponentsModule,
  ]
})
export class SignupModule { }
