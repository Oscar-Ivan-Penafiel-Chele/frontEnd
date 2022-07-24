import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarRoutingModule } from './car-routing.module';
import { CarComponent } from './page/car.component';
import { FormsModule } from '@angular/forms';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';
import { FooterModule } from 'src/app/shared/components/footer/footer.module';

@NgModule({
  declarations: [
    CarComponent
  ],
  imports: [
    CommonModule,
    CarRoutingModule,
    FormsModule,
    PrimengComponentsModule,
    FooterModule
  ]
})
export class CarModule { }
