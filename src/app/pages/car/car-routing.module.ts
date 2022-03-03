import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CarComponent } from './car.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes : Routes = [
  { path:'', component: CarComponent, data: {role : 5}, canActivate : [AuthGuard] ,pathMatch : 'full'},
  { path:'**' , redirectTo:''}
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports : [RouterModule],
})
export class CarRoutingModule { }
