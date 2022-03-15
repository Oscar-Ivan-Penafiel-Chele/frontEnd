import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidosComponent } from './pedidos.component';
import { PedidosRoutingModule } from './pedidos-routing.module';
import { SharedModule } from '../shared/shared.module';
import {ProgressSpinnerModule} from 'primeng/progressspinner';

@NgModule({
  declarations: [
    PedidosComponent
  ],
  imports: [
    CommonModule,
    PedidosRoutingModule,
    SharedModule,
    ProgressSpinnerModule
  ]
})
export class PedidosModule { }
