import { Component, Input, OnInit } from '@angular/core';
import { IPurchaseOrder } from '@models/interfaces';

@Component({
  selector: 'app-table-purchase-order',
  templateUrl: './table-purchase-order.component.html',
  styleUrls: ['./table-purchase-order.component.css']
})
export class TablePurchaseOrderComponent implements OnInit {

  @Input() purchase_orders: IPurchaseOrder[] = [];
  @Input() loading: boolean = false;
  @Input() dataAux: IPurchaseOrder[] = [];

  options : any [] = [];
  selectedOptionFilter : any;

  constructor() {
    this.options = [
      {id: '1', name : 'Completado'},
      {id: '2', name : 'Pendiente'},
      {id: '3', name : 'Todos'},
    ]
    this.selectedOptionFilter = 3;
   }

  ngOnInit(): void {
  }

  viewPurchaseOrderPDF(order: IPurchaseOrder){

  }

  change($event : any){
    let filter = 0;

    filter = $event.path[2].attributes[1].value

    if(filter == 1){
      this.purchase_orders = this.dataAux.filter( i => i.status == 'Completada')
    }else if( filter == 2){
      this.purchase_orders = this.dataAux.filter( i => i.status == 'Pendiente')
    }else if(filter == 3){
      this.purchase_orders = this.dataAux;
    }
  }
}
