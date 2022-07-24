import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayLoginComponent } from './page/overlay-login.component';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';



@NgModule({
  declarations: [
    OverlayLoginComponent
  ],
  imports: [
    CommonModule,
    PrimengComponentsModule
  ],
  exports : [
    OverlayLoginComponent
  ]
})
export class OverlayLoginModule { }
