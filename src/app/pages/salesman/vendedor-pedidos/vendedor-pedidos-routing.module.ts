import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { VendedorPedidosComponent } from './page/vendedor-pedidos.component';

const routes : Routes = [
  { path:'', component: VendedorPedidosComponent,pathMatch : 'full'},
  { path:'**' , redirectTo:''}
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports : [RouterModule]
})
export class VendedorPedidosRoutingModule { }
