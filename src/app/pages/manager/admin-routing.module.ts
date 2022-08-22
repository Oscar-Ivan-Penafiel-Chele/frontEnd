import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/page/dashboard.component';
import { AuthenticationGuard } from 'src/app/auth/guards/authentication/authentication.guard';
import { AuthorizationGuard } from 'src/app/auth/guards/authorization/authorization.guard';

const routes : Routes = [
  { path:'', component: DashboardComponent, canActivate : [AuthenticationGuard, AuthorizationGuard], data : { role : '1'},
    children : [
      {path: '', redirectTo: 'chart', pathMatch : 'full'},
      {path: 'chart', loadChildren : ()=> import('./charts/charts.module').then( m => m.ChartsModule)},
      {path: 'ingresos', loadChildren : ()=> import('./ingresos/ingresos.module').then( m => m.IngresosModule)},
      {path: 'egresos', loadChildren : ()=> import('./egresos/egresos.module').then( m => m.EgresosModule)},
      {path: 'report-venta', loadChildren : ()=> import('./report-sail/report-sail.module').then( m => m.ReportSailModule)},
      {path: 'estadistica-venta', loadChildren : ()=> import('./statistics-sail/statistics-sail.module').then( m => m.StatisticsSailModule)},
      {path: 'estadistica-compra', loadChildren : ()=> import('./statistics-purchase/statistics-purchase.module').then( m => m.StatisticsPurchaseModule)},
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
