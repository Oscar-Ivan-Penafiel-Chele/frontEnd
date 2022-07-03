import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayChangePasswordComponent } from './page/overlay-change-password.component';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {RippleModule} from 'primeng/ripple';


@NgModule({
  declarations: [
    OverlayChangePasswordComponent,
  ],
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    RippleModule
  ],
  exports : [
    OverlayChangePasswordComponent,
  ]
})
export class OverlayChangePasswordModule { }
