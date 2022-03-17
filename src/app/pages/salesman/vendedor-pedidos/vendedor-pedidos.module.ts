import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendedorPedidosComponent } from './vendedor-pedidos.component';
import { VendedorPedidosRoutingModule } from './vendedor-pedidos-routing.module';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';

@NgModule({
  declarations: [
    VendedorPedidosComponent
  ],
  imports: [
    CommonModule,
    VendedorPedidosRoutingModule,
    ProgressSpinnerModule,
    TableModule,
    ButtonModule,
    InputTextModule
  ]
})
export class VendedorPedidosModule { }
