import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, Routes } from '@angular/router';
import { PersonalComponent } from './page/personal.component';
import { AuthenticationGuard } from 'src/app/auth/guards/authentication/authentication.guard';
import { AuthorizationGuard } from 'src/app/auth/guards/authorization/authorization.guard';

const routes : Routes = [
  { path:'', component: PersonalComponent, data: {role : 5}, canActivate : [AuthenticationGuard, AuthorizationGuard] ,pathMatch : 'full'},
  { path:'**' , redirectTo:''}
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports : [RouterModule]
})
export class PersonalRoutingModule { }
