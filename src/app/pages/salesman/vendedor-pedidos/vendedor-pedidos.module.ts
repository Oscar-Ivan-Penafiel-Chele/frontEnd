import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendedorPedidosComponent } from './page/vendedor-pedidos.component';
import { VendedorPedidosRoutingModule } from './vendedor-pedidos-routing.module';
import { FormsModule } from '@angular/forms';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';

@NgModule({
  declarations: [
    VendedorPedidosComponent
  ],
  imports: [
    CommonModule,
    VendedorPedidosRoutingModule,
    FormsModule,
    PrimengComponentsModule
  ]
})
export class VendedorPedidosModule { }
