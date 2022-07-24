import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportSailComponent } from './page/report-sail.component';
import { ReportSailRoutingModule } from './report-sail-routing.module';
import { FormsModule } from '@angular/forms';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';

@NgModule({
  declarations: [
    ReportSailComponent
  ],
  imports: [
    CommonModule,
    ReportSailRoutingModule,
    FormsModule,
    PrimengComponentsModule
  ]
})
export class ReportSailModule { }
