import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './page/profile.component';

const routes : Routes = [
  { path:'', component: ProfileComponent,},
  { path:'**' , redirectTo:''}
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports : [RouterModule]
})
export class ProfileRoutingModule { }