import { Component, Host, Input, OnInit } from '@angular/core';
import { TablePurchaseOrderComponent } from '../table_purchase_order/table-purchase-order.component';

@Component({
  selector: 'app-detail-purchase-order',
  templateUrl: './detail-purchase-order.component.html',
  styleUrls: ['./detail-purchase-order.component.css']
})
export class DetailPurchaseOrderComponent implements OnInit {

  @Input() displayModal: boolean = false;
  @Input() selectedProducts: string[] = [];
  @Input() productsPurchaseOrder: any;
  @Input() informationProvider: any;
  @Input() idPurchaseOrder?: number = 0;

  constructor(@Host() private tablePurchase: TablePurchaseOrderComponent) { }

  ngOnInit(): void {
  }

  saveData(){
    const data = {
      id_purchase_order: this.idPurchaseOrder!,
      products: this.productsPurchaseOrder
    };

    console.log(data);
    this.tablePurchase.displayModal = false;
  }


  changeStyle($event: any, product: any){
    let item_product;
    let item_amount;

    const path = $event.originalEvent.path[0];

    if(path.localName == "span"){
      item_product = $event.originalEvent.path[5].children[1].children[1];
      item_amount = $event.originalEvent.path[5].children[2].children[1];
      product.purchase_order_products_status = 0;
    }else{
      item_product = $event.originalEvent.path[4].children[1].children[1];
      item_amount = $event.originalEvent.path[4].children[2].children[1];
      product.purchase_order_products_status = 1;
    }

    item_product?.classList.toggle('unselected');
    item_amount?.classList.toggle('unselected');
  }

  onRowEditInit(product: any) {}
  onRowEditSave(product: any) {
    product.purchase_order_products_amount = product.purchase_order_products_amount.toFixed(2);
  }
  onRowEditCancel(product: any, index: number) {}

  resetModal(){
    this.displayModal = false;
    this.tablePurchase.displayModal = false;
  }
}
