import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageIvaComponent } from './page/manage-iva.component';

const routes: Routes = [
  { path:'', component: ManageIvaComponent},
  { path:'**' , redirectTo:''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageIvaRoutingModule { }
