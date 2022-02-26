import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarRoutingModule } from './car-routing.module';
import { CarComponent } from './car.component';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {InputNumberModule} from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';

@NgModule({
  declarations: [
    CarComponent
  ],
  imports: [
    CommonModule,
    CarRoutingModule,
    ProgressSpinnerModule,
    InputNumberModule,
    FormsModule,
    InputTextModule,
    ButtonModule
  ]
})
export class CarModule { }
