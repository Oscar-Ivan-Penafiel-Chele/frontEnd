import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes : Routes = [
  { path:'', component: DashboardComponent, canActivate : [AuthGuard], data : { role : '1'},
    children : [
      {path: '', redirectTo: 'chart', pathMatch : 'full'},
      {path: 'chart', loadChildren : ()=> import('./charts/charts.module').then( m => m.ChartsModule)},
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
