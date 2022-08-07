import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseOrderRoutingModule } from './purchase-order-routing.module';
import { PurchaseOrderComponent } from './page/purchase-order.component';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';
import { CreateOrderModule } from './components/create_purchase_order/create-order.module';
import { TablePurchaseOrderComponent } from './components/table_purchase_order/table-purchase-order.component';
import { FormsModule } from '@angular/forms';
import { OverlayRequestModule } from 'src/app/shared/components/overlay_request/overlay-request.module';


@NgModule({
  declarations: [
    PurchaseOrderComponent,
    TablePurchaseOrderComponent
  ],
  imports: [
    CommonModule,
    PurchaseOrderRoutingModule,
    PrimengComponentsModule,
    CreateOrderModule,
    FormsModule,
    OverlayRequestModule
  ]
})
export class PurchaseOrderModule { }
