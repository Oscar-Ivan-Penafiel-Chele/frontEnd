import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswordComponent } from './page/change-password.component';
import { ChangePasswordRoutingModule } from './change-password-routing.module';
import { FormsModule } from '@angular/forms';
import { OverlayChangePasswordModule } from 'src/app/shared/components/overlay-change-password/overlay-change-password.module';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';

@NgModule({
  declarations: [
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    ChangePasswordRoutingModule,
    FormsModule,
    OverlayChangePasswordModule,
    PrimengComponentsModule
  ]
})
export class ChangePasswordModule { }
