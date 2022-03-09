import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngresosComponent } from './ingresos.component';
import { IngresosRoutingModule } from './ingresos-routing.module';
import {TableModule} from 'primeng/table';
import {ToolbarModule} from 'primeng/toolbar';
import {TooltipModule} from 'primeng/tooltip';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {DialogModule} from 'primeng/dialog';

@NgModule({
  declarations: [
    IngresosComponent
  ],
  imports: [
    CommonModule,
    IngresosRoutingModule,
    TableModule,
    ToolbarModule,
    TooltipModule,
    InputTextModule,
    ButtonModule,
    DialogModule
  ]
})
export class IngresosModule { }
