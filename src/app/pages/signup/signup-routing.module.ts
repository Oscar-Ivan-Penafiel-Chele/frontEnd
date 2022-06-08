import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup.component';
import { AuthorizationGuard } from 'src/app/guards/authorization/authorization.guard';

const routes : Routes = [
  { path:'', component: SignupComponent, pathMatch : 'full', canActivate : [AuthorizationGuard]},
  { path:'**' , redirectTo:''}
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports : [RouterModule],
})
export class SignupRoutingModule { }
