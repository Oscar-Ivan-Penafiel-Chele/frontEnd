import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecoveryPasswordRoutingModule } from './recovery-password-routing.module';
import { RecoverPasswordComponent } from './page/recover-password.component';
import { BackgroundAnimateModule } from 'src/app/shared/components/background-animate/background-animate.module';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';
import { FormsModule } from '@angular/forms';
import { OverlayRequestModule } from 'src/app/shared/components/overlay_request/overlay-request.module';

@NgModule({
  declarations: [
    RecoverPasswordComponent
  ],
  imports: [
    CommonModule,
    RecoveryPasswordRoutingModule,
    BackgroundAnimateModule,
    PrimengComponentsModule,
    FormsModule,
    OverlayRequestModule
  ]
})
export class RecoveryPasswordModule { }
