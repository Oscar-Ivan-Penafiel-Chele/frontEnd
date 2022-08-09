import { Component, Host, Input, OnInit } from '@angular/core';
import { PurchaseOrderService } from '../../service/purchase-order.service';
import { TablePurchaseOrderComponent } from '../table_purchase_order/table-purchase-order.component';
import {MessageService} from 'primeng/api';
import { User } from '@models/interfaces';

@Component({
  selector: 'app-detail-purchase-order',
  templateUrl: './detail-purchase-order.component.html',
  styleUrls: ['./detail-purchase-order.component.css'],
  providers: [MessageService]
})
export class DetailPurchaseOrderComponent implements OnInit {

  @Input() displayModal: boolean = false;
  @Input() selectedProducts: string[] = [];
  @Input() productsPurchaseOrder: any;
  @Input() informationProvider: any;
  @Input() idPurchaseOrder?: number = 0;

  opctionsPay: any[] = [];
  selectedPay: any;
  purchase_order_total: any;
  user: User = {};
  submitted: boolean = false;

  constructor(
    @Host() private tablePurchase: TablePurchaseOrderComponent, 
    private purchaseOrderService: PurchaseOrderService,
    private messageService: MessageService,
    ) { 
    this.opctionsPay = [
      {id: 1, value:'Efectivo'},
      {id: 2, value:'Cheque'},
      {id: 3, value:'Transferencia bancaria'},
    ]
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(){
    const data = localStorage.getItem('user');

    this.user = JSON.parse(data!);
  }

  saveData(){
    this.submitted = true;

    if(!this.validateData()) return;

    const data = {
      id_purchase_order: this.idPurchaseOrder!,
      id_user: this.user.id_user,
      products: this.productsPurchaseOrder,
      tipe_of_pay: this.selectedPay,
      purchase_order_total: this.purchase_order_total,
    };

    this.purchaseOrderService.completePurchaseOrder(data).subscribe((response: any)=>{
      this.tablePurchase.displayModal = false;
      this.tablePurchase.showMessage(response);
    });
  }

  validateData(){
    if(!this.selectedPay || this.selectedPay == null || !this.purchase_order_total || this.purchase_order_total == null){
      return false;
    }

    return true;
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
