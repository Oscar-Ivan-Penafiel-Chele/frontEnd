import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgetPasswordRoutingModule } from './forget-password-routing.module';
import { ForgetPasswordComponent } from './page/forget-password.component';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';
import { FormsModule } from '@angular/forms';
import { BackgroundAnimateModule } from 'src/app/shared/components/background-animate/background-animate.module';
import { OverlayRequestModule } from 'src/app/shared/components/overlay_request/overlay-request.module';

@NgModule({
  declarations: [
    ForgetPasswordComponent,
  ],
  imports: [
    CommonModule,
    ForgetPasswordRoutingModule,
    PrimengComponentsModule,
    FormsModule,
    BackgroundAnimateModule,
    OverlayRequestModule
  ]
})
export class ForgetPasswordModule { }
