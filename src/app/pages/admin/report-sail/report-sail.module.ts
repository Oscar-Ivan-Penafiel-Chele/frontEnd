import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportSailComponent } from './report-sail.component';
import { ReportSailRoutingModule } from './report-sail-routing.module';

@NgModule({
  declarations: [
    ReportSailComponent
  ],
  imports: [
    CommonModule,
    ReportSailRoutingModule
  ]
})
export class ReportSailModule { }
