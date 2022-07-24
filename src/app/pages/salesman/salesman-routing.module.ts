import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesmanComponent } from './page/salesman.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from 'src/app/auth/guards/authentication/authentication.guard';
import { AuthorizationGuard } from 'src/app/auth/guards/authorization/authorization.guard';

const routes : Routes = [
  { path:'', component: SalesmanComponent, canActivate : [AuthenticationGuard, AuthorizationGuard], data : { role : '4'},
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
