import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateOrderComponent } from './components/create_purchase_order/page/create-order.component';
import { PurchaseOrderComponent } from './page/purchase-order.component';

const routes: Routes = [
  { path:'', component: PurchaseOrderComponent,
    children: [
      { path:'create-purchase-order' , component: CreateOrderComponent}
    ]
  },
  { path:'**' , redirectTo:''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseOrderRoutingModule { }
