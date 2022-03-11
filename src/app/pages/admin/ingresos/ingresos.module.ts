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
import {CalendarModule} from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import {OverlayPanelModule} from 'primeng/overlaypanel';

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
    DialogModule,
    CalendarModule,
    FormsModule,
    OverlayPanelModule
  ]
})
export class IngresosModule { }
