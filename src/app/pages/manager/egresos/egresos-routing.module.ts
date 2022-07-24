import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EgresosComponent } from './page/egresos.component';

const routes: Routes = [
  { path:'', component: EgresosComponent},
  { path:'**' , redirectTo:''}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports : [RouterModule]
})
export class EgresosRoutingModule { }
