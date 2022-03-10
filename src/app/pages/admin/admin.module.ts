import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import {TooltipModule} from 'primeng/tooltip';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { ReportIngresoComponent } from './report-ingreso/report-ingreso.component';
import { ReportEgresoComponent } from './report-egreso/report-egreso.component';
import { ReportSailComponent } from './report-sail/report-sail.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ReportIngresoComponent,
    ReportEgresoComponent,
    ReportSailComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    TooltipModule,
    ProgressSpinnerModule,
    ScrollPanelModule,
    ConfirmDialogModule
  ]
})
export class AdminModule { }
