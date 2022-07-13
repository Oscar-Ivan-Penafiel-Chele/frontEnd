import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MessageService, Message} from 'primeng/api';
import { HomeService } from 'src/app/services/home.service';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { environment } from 'src/environments/environment.prod';
import { Product } from 'src/app/models/product';
import { Order } from 'src/app/models/order';
import { User } from 'src/app/models/user';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css'],
  providers: [MessageService]
})
export class ConfirmationComponent implements OnInit {

  public payPalConfig?: IPayPalConfig;
  user : User = {};
  showSuccess : boolean = false;
  showMessage : boolean = false;
  clientID : string = environment.CLIENT_ID_PAYPAL;
  products : Product[] = [];
  items_products : any[] = [];
  order : Order = {} as Order;
  showOverlay : boolean = false;
  msg : Message[] = [];
  idAddress : number = 0;

  constructor(
    private _router : Router,
    private _home : HomeService,
    private messageService: MessageService,
    private _rest : RestService,
  ) { }

  ngOnInit(): void {
    this.orderFunctions();
  }

  async orderFunctions(){
    await this.getDataProfile();
    await this.getProducts();
    await this.getOrder();
    await this.initConfig();
  }

  prevPage() {
    this._router.navigate(['checkout/order/payment']);
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
            value: (this.order.price_order_total).toFixed(2).toString(),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: (this.order.price_order_total).toFixed(2).toString()
              }
            }
          },
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
      actions.order.get().then((details : any) => {
        //console.log('onApprove - you can get full order details inside onApprove: ', details);
      });
    },
    onClientAuthorization: (data) => {
      if(data.status === "COMPLETED"){
        this.msg = [
          {severity:'success', summary:'Completado', detail:'El pago se realizó con éxito'},
        ];
        this.completProcess();
      }
    },
    onError: err => {
      this.msg = [
        {severity:'error', summary:'Error', detail:'No se pudo realizar el pago, verifique su cuenta'},
      ];
      this.showMessage = true;
      //this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudo realizar el pago, verifique su cuenta'});
      console.log('OnError', err);
    }
  };
  }

  async completProcess(){
    await this.addSail();
    await this.redirection();
  }

  async addSail(){
    this.showOverlay = true;
    const data = {
      id_user : this.user.id_user,
      order_price_total : this.order.price_order_total,
      products : this.products,
      id_address : this.idAddress,
    }

    this._rest.createOrder(data).subscribe((response : any)=>{
      if(response.status == 200 || response.message == "Guardado con exito"){
        this.showMessage = true;
        localStorage.removeItem('information_sending');
        localStorage.removeItem('subtotal');
        localStorage.removeItem('total');
        localStorage.removeItem('producto');
        this.showSuccess = true;
        
      }else if(response.status == 500){
        console.log(response.message);
        this.showOverlay = false;
      }
    });
  }

  async getDataProfile(){
    let data = localStorage.getItem('user');

    this.idAddress = parseInt(localStorage.getItem('information_address')!);

    this.user = JSON.parse(data!);
  }

  async redirection(){
    setTimeout(() => {
      this._router.navigate(['/my-orders']);
    }, 5000);
  }

  async getProducts(){
    let data = localStorage.getItem('producto');
    this.products = JSON.parse(data!);
  }

  async getOrder(){
    let data = localStorage.getItem('total');
    this.order.price_order_total = JSON.parse(data!);
    console.log(this.order.price_order_total);
  }
}
