import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarRoutingModule } from './car-routing.module';
import { CarComponent } from './car.component';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {InputNumberModule} from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import { TagModule } from 'primeng/tag';
import {ToastModule} from 'primeng/toast';
import {TableModule} from 'primeng/table';
import { SharedModule } from '../shared/shared.module';

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
    ButtonModule,
    TagModule,
    ToastModule,
    TableModule,
    SharedModule
  ]
})
export class CarModule { }
