import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, Routes } from '@angular/router';
import { ConfirmationComponent } from './page/confirmation.component';
import { AuthenticationGuard } from 'src/app/auth/guards/authentication/authentication.guard';
import { AuthorizationGuard } from 'src/app/auth/guards/authorization/authorization.guard';

const routes : Routes = [
  { path:'', component: ConfirmationComponent, data: {role : 5}, canActivate : [AuthenticationGuard, AuthorizationGuard] ,pathMatch : 'full'},
  { path:'**' , redirectTo:''}
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports : [RouterModule]
})
export class ConfirmationRoutingModule { }
