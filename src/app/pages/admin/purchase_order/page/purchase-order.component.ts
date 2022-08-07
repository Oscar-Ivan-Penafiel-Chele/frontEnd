import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IPurchaseOrder } from '@models/interfaces';
import { CreateOrderComponent } from '../components/create_purchase_order/page/create-order.component';
import { PurchaseOrderService } from '../service/purchase-order.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css'],
  providers: [MessageService]
})
export class PurchaseOrderComponent implements OnInit {
  @ViewChild(CreateOrderComponent) private createComponent!: CreateOrderComponent;

  purchase_orders: IPurchaseOrder[] = [];
  loading: boolean = false;
  dataAux: IPurchaseOrder[] = []
  index: number = 0;

  showOverlay: boolean = false;
  loadRequest: boolean = false;
  textOverlay: string = "";
  textResponse: string = "";
  iconResponse: string = "";
  iconOkResponse : string = "pi pi-check-circle response_ok";
  iconErrorResponse : string = "pi pi-times-circle response_error";

  constructor(
    private messageService: MessageService,
    private router: Router,
    private purchaseOrderService: PurchaseOrderService
  ) { }

  ngOnInit(): void {
    this.getPurchaseOrder();
  }

  getPurchaseOrder(){
    this.loading = true;
    this.purchaseOrderService.getPurchaseOrders().subscribe((response : any)=>{
      this.loading = false;
      this.purchase_orders = Object.values(response);
    })
  }

  savePurchaseOrder(purchase: IPurchaseOrder){
    this.showOverlay = true;
    this.loadRequest = true;
    this.textOverlay = "Generando Orden de Compra"

    this.purchaseOrderService.createPurchaseOrder(purchase).subscribe((response: any)=>{
      this.showMessage(response);
    })
  }

  showMessage(response: any){
    if(response.status == 200 || response.message == "Orden de compra creada con exito"){
      this.iconResponse = this.iconOkResponse;
      this.textResponse = "Orden de compra creada con éxito";
      this.getPurchaseOrder();
      this.createComponent.resetData();
      this.index = 0;
      // this.messageService.add({severity:'success', summary: 'Completado', detail: 'Orden de compra creada con éxito'});
    }else if(response.status >= 400){
      this.iconResponse = this.iconErrorResponse;
      this.textResponse = `${response.message[0]}`;
      // this.messageService.add({severity:'error', summary: 'Error', detail: `${response.message[0]}`});
    }
  }
}
