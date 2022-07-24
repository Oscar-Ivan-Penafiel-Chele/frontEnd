import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonUpComponent } from './page/button-up.component';
import { PrimengComponentsModule } from '../primeng-components/primeng-components.module';

@NgModule({
  declarations: [
    ButtonUpComponent
  ],
  imports: [
    CommonModule,
    PrimengComponentsModule
  ],
  exports : [
    ButtonUpComponent
  ]
})
export class ButtonUpModule { }
