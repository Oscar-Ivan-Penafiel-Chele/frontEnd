import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'src/app/services/home.service';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { environment } from 'src/environments/environment.prod';
import { Product } from 'src/app/models/product';
import { Order } from 'src/app/models/order';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

  public payPalConfig?: IPayPalConfig;
  a : any;
  showSuccess : boolean = false;
  clientID : string = environment.CLIENT_ID_PAYPAL;
  products : Product[] = [];
  items_products : any[] = [];
  order : Order = {} as Order;

  constructor(
    private _router : Router,
    private _home : HomeService
  ) { }

  ngOnInit(): void {
    this.orderFunctions();
  }

  async orderFunctions(){
    await this.getProducts();
    await this.getOrder();
    await this.initConfig();
  }

  prevPage() {
    this._router.navigate(['checkout/order/payment']);
  }

  complete(){
    
  }
  
  async initConfig() {
    this.payPalConfig = {
    currency: 'USD',
    clientId: this.clientID,
    createOrderOnClient: (data) => <ICreateOrderRequest>{
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: (this.order.price_order_total).toString(),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: (this.order.price_order_total).toString()
              }
            }
          },
          items : this.items_products,
        }
      ]
    },
    advanced: {
      commit: 'true'
    },
    style: {
      label: 'paypal',
      layout: 'vertical'
    },
    onApprove: (data, actions) => {
      console.log('onApprove - transaction was approved, but not authorized', data, actions);
      actions.order.get().then((details : any) => {
        console.log('onApprove - you can get full order details inside onApprove: ', details);
      });
    },
    onClientAuthorization: (data) => {
      console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      this.showSuccess = true;
    },
    onCancel: (data, actions) => {
      console.log('OnCancel', data, actions);
    },
    onError: err => {
      console.log('OnError', err);
    },
    onClick: (data, actions) => {
      console.log('onClick', data, actions);
    },
  };
  }


  addSail(){
    this.items_products
  }

  async getProducts(){
    let data = localStorage.getItem('producto');
    this.products = JSON.parse(data!);

    this.products.map((i)=>{
      this.items_products.push({ name: i.product_name, quantity: (i.product_amount_sail)?.toString(), category : i.category.category_name, unit_amount :{ currency_code: 'USD', value: (i.product_price)?.toString(),}});
    });

    console.log(this.items_products);
  }

  async getOrder(){
    let data = localStorage.getItem('price_total');
    this.order = JSON.parse(data!);
  }
}
