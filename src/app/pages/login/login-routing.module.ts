import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './page/login.component';
import { AuthorizationGuard } from 'src/app/auth/guards/authorization/authorization.guard';


const routes : Routes = [
  { path:'', component: LoginComponent, pathMatch : 'full', canActivate : [AuthorizationGuard]},
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
