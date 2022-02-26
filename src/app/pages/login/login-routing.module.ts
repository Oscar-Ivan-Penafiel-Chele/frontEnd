import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { LoginGuard } from 'src/app/guards/login.guard';

const routes : Routes = [
  { path:'', component: LoginComponent, pathMatch : 'full', canActivate : [LoginGuard]},
  { path:'**' , redirectTo:''}
]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports : [RouterModule],
})
export class LoginRoutingModule { }
