import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddressUserComponent } from './page/address-user.component';

const routes: Routes = [
  { path:'', component: AddressUserComponent, },
  { path:'**' , redirectTo:''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddressRoutingModule { }
