import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IngresosComponent } from './page/ingresos.component';

const routes: Routes = [
  { path:'', component: IngresosComponent},
  { path:'**' , redirectTo:''}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports : [RouterModule]
})
export class IngresosRoutingModule { }
