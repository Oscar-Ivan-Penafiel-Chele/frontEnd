import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidosComponent } from './page/pedidos.component';
import { PedidosRoutingModule } from './pedidos-routing.module';
import { FooterModule } from 'src/app/shared/components/footer/footer.module';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PedidosComponent
  ],
  imports: [
    CommonModule,
    PedidosRoutingModule,
    FooterModule,
    PrimengComponentsModule,
    FormsModule
  ]
})
export class PedidosModule { }
