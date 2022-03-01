import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes : Routes = [
  { path:'', component: DashboardComponent, canActivate : [AuthGuard], data : { role : '1'},
    children : [
      {path: '', redirectTo: 'products', pathMatch : 'full'},
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
