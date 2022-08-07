import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IPurchaseOrder } from '@models/interfaces';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css']
})
export class PurchaseOrderComponent implements OnInit {

  purchase_orders: IPurchaseOrder[] = [];
  loading: boolean = false;
  dataAux: IPurchaseOrder[] = []
  index: number = 0;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  savePurchaseOrder(purchase: IPurchaseOrder){
    console.log(purchase)
    //this.index = 0;
  }
}
