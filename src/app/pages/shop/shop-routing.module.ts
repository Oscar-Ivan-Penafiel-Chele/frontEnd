import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ShopComponent } from './page/shop.component';

const routes : Routes = [
  { path:'', component: ShopComponent, pathMatch : 'full', data: {role : 5}},
  { path:'**' , redirectTo:''}
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports : [RouterModule],
})
export class ShopRoutingModule { }
