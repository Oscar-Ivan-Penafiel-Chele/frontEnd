import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/guards/auth.guard';
import { AddressUserComponent } from './page/address-user.component';

const routes: Routes = [
  { path:'', component: AddressUserComponent, canActivate: [AuthGuard]},
  { path:'**' , redirectTo:''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddressRoutingModule { }
