import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { SalesmanComponent } from './salesman.component';
import { RouterModule, Routes } from '@angular/router';

const routes : Routes = [
  { path:'', component: SalesmanComponent, canActivate : [AuthGuard], data : { role : '4'},
    children : [
      {path: '', redirectTo: 'pedidos', pathMatch : 'full'},
      {path: 'pedidos', loadChildren : ()=> import('./vendedor-pedidos/vendedor-pedidos.module').then( m => m.VendedorPedidosModule)},
    ]
  },
  { path:'**' , redirectTo:''}
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports : [RouterModule]
})
export class SalesmanRoutingModule { }
