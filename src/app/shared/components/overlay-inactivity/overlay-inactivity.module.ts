import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayInactivityComponent } from './page/overlay-inactivity.component';
import { PrimengComponentsModule } from '../primeng-components/primeng-components.module';

@NgModule({
  declarations: [
    OverlayInactivityComponent
  ],
  imports: [
    CommonModule,
    PrimengComponentsModule
  ],
  exports:[
    OverlayInactivityComponent
  ]
})
export class OverlayInactivityModule { }
