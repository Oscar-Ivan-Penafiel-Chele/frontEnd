import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayRequestComponent } from './page/overlay-request.component';
import { PrimengComponentsModule } from '../primeng-components/primeng-components.module';



@NgModule({
  declarations: [
    OverlayRequestComponent
  ],
  imports: [
    CommonModule,
    PrimengComponentsModule
  ],
  exports : [
    OverlayRequestComponent
  ]
})
export class OverlayRequestModule { }
