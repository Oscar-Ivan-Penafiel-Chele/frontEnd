import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackgroundAnimateComponent } from './page/background-animate.component';



@NgModule({
  declarations: [
    BackgroundAnimateComponent
  ],
  imports: [
    CommonModule
  ],
  exports : [
    BackgroundAnimateComponent
  ]
})
export class BackgroundAnimateModule { }
