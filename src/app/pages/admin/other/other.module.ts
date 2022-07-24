import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OtherComponent } from './other.component';
import { OtherRoutingModule } from './other-routing.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';

@NgModule({
  declarations: [
    OtherComponent,
  ],
  imports: [
    CommonModule,
    OtherRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimengComponentsModule
  ]
})
export class OtherModule { }
