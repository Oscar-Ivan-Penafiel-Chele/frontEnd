import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OtherComponent } from './other.component';
import { OtherRoutingModule } from './other-routing.module';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

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
    ProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class OtherModule { }
