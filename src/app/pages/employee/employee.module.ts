import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeRoutingModule } from './employee-routing.module';
import { DashboardEmployeeComponent } from './dashboard-employee/dashboard-employee.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {TooltipModule} from 'primeng/tooltip';

@NgModule({
  declarations: [
    DashboardEmployeeComponent,
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    TooltipModule,
  ]
})
export class EmployeeModule { }
