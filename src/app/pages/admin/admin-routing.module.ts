import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthorizationGuard } from 'src/app/guards/authorization/authorization.guard';
import { AuthenticationGuard } from 'src/app/guards/authentication/authentication.guard';

const routes : Routes = [
  { path:'', component: DashboardComponent, canActivate : [AuthenticationGuard, AuthorizationGuard], data : { role : '1'},
    children : [
      {path: '', redirectTo: 'chart', pathMatch : 'full'},
      {path: 'chart', loadChildren : ()=> import('./charts/charts.module').then( m => m.ChartsModule)},
      {path: 'ingresos', loadChildren : ()=> import('./ingresos/ingresos.module').then( m => m.IngresosModule)},
      {path: 'egresos', loadChildren : ()=> import('./egresos/egresos.module').then( m => m.EgresosModule)},
      {path: 'report-venta', loadChildren : ()=> import('./report-sail/report-sail.module').then( m => m.ReportSailModule)},
    ]
  },
  { path:'**' , redirectTo:''}
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports : [RouterModule]
})
export class AdminRoutingModule { }
