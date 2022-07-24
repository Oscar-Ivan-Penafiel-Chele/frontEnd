import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeRoutingModule } from './employee-routing.module';
import { DashboardEmployeeComponent } from './dashboard-employee/page/dashboard-employee.component';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';

@NgModule({
  declarations: [
    DashboardEmployeeComponent,
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    PrimengComponentsModule
  ]
})
export class EmployeeModule { }
