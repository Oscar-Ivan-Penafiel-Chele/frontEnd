import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportSailComponent } from './report-sail.component';
import { ReportSailRoutingModule } from './report-sail-routing.module';
import {InputNumberModule} from 'primeng/inputnumber';
import {ToastModule} from 'primeng/toast';
import {ToolbarModule} from 'primeng/toolbar';
import {CalendarModule} from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import {TableModule} from 'primeng/table';
import {InputTextModule} from 'primeng/inputtext';

@NgModule({
  declarations: [
    ReportSailComponent
  ],
  imports: [
    CommonModule,
    ReportSailRoutingModule,
    ToastModule,
    InputNumberModule,
    ToolbarModule,
    CalendarModule,
    FormsModule,
    TableModule,
    InputTextModule
  ]
})
export class ReportSailModule { }
