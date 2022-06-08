import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, Routes } from '@angular/router';
import { ConfirmationComponent } from './confirmation.component';
import { AuthorizationGuard } from 'src/app/guards/authorization/authorization.guard';
import { AuthenticationGuard } from 'src/app/guards/authentication/authentication.guard';

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
