import { Component, Host, Input, OnInit } from '@angular/core';
import { IPurchaseOrder, IPurchaseOrderProducts } from '@models/interfaces';
import {ConfirmationService, MessageService} from 'primeng/api';
import { PurchaseOrderPdfService } from 'src/app/shared/services/pdfs/purchase-order-pdf.service';
import { PurchaseOrderComponent } from '../../page/purchase-order.component';
import { PurchaseOrderService } from '../../service/purchase-order.service';

@Component({
  selector: 'app-table-purchase-order',
  templateUrl: './table-purchase-order.component.html',
  styleUrls: ['./table-purchase-order.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class TablePurchaseOrderComponent implements OnInit {

  @Input() purchase_orders: IPurchaseOrder[] = [];
  @Input() loading: boolean = false;
  @Input() dataAux: IPurchaseOrder[] = [];

  options : any [] = [];
  selectedOptionFilter : any;
  
  displayModal: boolean = false;
  selectedProducts: string[] = [];
  productsPurchaseOrder: any;
  informationProvider: any;
  idPurchaseOrder?: number = 0;
  clonedProducts: any = {};

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private purchaseOrderService : PurchaseOrderService,
    private purchaseOrderPDF: PurchaseOrderPdfService,
    @Host() private purchaseOrderComponent: PurchaseOrderComponent,
  ) {
    this.options = [
      {id: '1', name : 'Completado'},
      {id: '2', name : 'Pendiente'},
      {id: '3', name : 'Todos'},
    ]
    this.selectedOptionFilter = 3;
   }

  ngOnInit(): void {
  }

  getData(){
    this.purchaseOrderComponent.getPurchaseOrder();
  }

  viewPurchaseOrderPDF(order: IPurchaseOrder){
    this.purchaseOrderPDF.generatePDF(order);
  }

  completePurchaseOrder(purchase_order: IPurchaseOrder){
    this.confirmationService.confirm({
      message: '¿Estás seguro de completar la orden de pago?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.requestPurchaseOrder(purchase_order);
      },
    });
  }

  requestPurchaseOrder(purchase_order: IPurchaseOrder){
    this.purchaseOrderService.completePurchaseOrder(purchase_order).subscribe((response: any)=>{
      if(response.status == 200 || response.message == ""){
        this.messageService.add({severity:'success', summary:'Completado', detail:'La orde de compra fue completada con éxito'});
        this.purchaseOrderComponent.getPurchaseOrder();
      }else if(response.status >= 400){
        this.messageService.add({severity:'error', summary:'Error', detail:'Ha ocurrido un error en el servidor'});
      }
    });
  }

  change($event : any){
    let filter = 0;

    filter = $event.path[2].attributes[1].value

    if(filter == 1){
      this.purchase_orders = this.dataAux.filter( i => i.purchase_order_status == 1)
    }else if( filter == 2){
      this.purchase_orders = this.dataAux.filter( i => i.purchase_order_status == 0)
    }else if(filter == 3){
      this.purchase_orders = this.dataAux;
    }
  }

  openModal(purchase_order: any){
    this.idPurchaseOrder = purchase_order.id_purchase_order;
    this.informationProvider = purchase_order.provider;
    this.productsPurchaseOrder = purchase_order.purchase_order_productos;
    this.selectedProducts = this.productsPurchaseOrder;

    this.displayModal = true;
  }

  showMessage(response: any){
    if(response.status == 200 || response.message == "Orden de compra completada con exito"){
      this.messageService.add({severity:'success', summary: 'Completado', detail: 'Orden de compra completada con éxito'});
    }else if(response.status >= 400){
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un problema en el servidor'});
    }
  }
}
