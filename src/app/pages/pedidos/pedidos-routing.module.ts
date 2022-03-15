import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { PedidosComponent } from './pedidos.component';
import { RouterModule, Routes } from '@angular/router';

const routes : Routes = [
  { path:'', component: PedidosComponent, data: {role : 5}, canActivate : [AuthGuard] ,pathMatch : 'full'},
  { path:'**' , redirectTo:''}
]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports : [ RouterModule ]
})
export class PedidosRoutingModule { }
