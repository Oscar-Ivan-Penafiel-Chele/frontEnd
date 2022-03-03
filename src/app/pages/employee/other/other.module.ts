import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OtherComponent } from './other.component';
import { OtherRoutingModule } from './other-routing.module';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';

@NgModule({
  declarations: [
    OtherComponent,
  ],
  imports: [
    CommonModule,
    OtherRoutingModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
  ]
})
export class OtherModule { }
