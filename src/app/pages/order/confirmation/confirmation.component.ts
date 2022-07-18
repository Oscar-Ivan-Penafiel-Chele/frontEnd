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
  loadOrder : boolean = false;
  completeOk : boolean = false;
  iconResponse : string = "";
  iconOkResponse : string = "pi pi-check-circle response_ok";
  iconErrorResponse : string = "pi pi-times-circle response_error";
  textResponse : string ="";
  showButtonOrders : boolean = false;
  textOverlay : string = "";
  showButtons : boolean = false;

  constructor(
    private _router : Router,
    private _home : HomeService,
    private messageService: MessageService,
    private _rest : RestService,
  ) { }

  ngOnInit(): void {
    this.orderFunctions();
    this.showOverlay = false;
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
      this.showOverlay = true;
      this.loadOrder = true;
      this.textOverlay = "Realizando Pago"
      actions.order.get().then((details : any) => {
        //console.log('onApprove - you can get full order details inside onApprove: ', details);
      });
    },
    onClientAuthorization: (data) => {
      if(data.status === "COMPLETED"){
        this.loadOrder = false;
        this.iconResponse = this.iconOkResponse;
        this.textResponse = "Pago realizado con éxito!";
        this.showButtons = false;

        setTimeout(() => {
          this.loadOrder = true;
          this.textOverlay = "Generando pedido"
          this.completProcess();
        }, 2000);
      }
    },
    onError: err => {
      this.loadOrder = false;
      this.iconResponse = this.iconErrorResponse;
      this.textResponse = "No se pudo realizar el pago, verifique el estado de su cuenta";
      this.showButtons = true;
      this.showButtonOrders = false;
      
      console.log('OnError', err);
    },
    onClick: (data, actions) => {
      console.log('onClick', data, actions);
    }
  };
  }

  async completProcess(){
    await this.addSail();
  }

  async addSail(){
    const data = {
      id_user : this.user.id_user,
      order_price_total : this.order.price_order_total,
      products : this.products,
      id_address : this.idAddress,
      address_reference : this.user.user_address_reference
    }

    this._rest.createOrder(data).subscribe((response : any)=>{
      this.loadOrder = false;
      this.showButtons = true;

      if(response.status == 200 || response.message == "Guardado con exito"){
        this.iconResponse = this.iconOkResponse;
        this.textResponse = "Pedido realizado con éxito!";
        this.showButtonOrders = true;

        localStorage.removeItem('information_sending');
        localStorage.removeItem('information_address');
        localStorage.removeItem('subtotal');
        localStorage.removeItem('total');
        localStorage.removeItem('producto');

      }else if(response.status == 500 || response.status == 400){
        this.iconResponse = this.iconErrorResponse;
        this.textResponse = "Ocurrio un problema en el servidor";
        this.showButtonOrders = false;
      }
    });
  }

  async getDataProfile(){
    let data = localStorage.getItem('information_sending');

    this.idAddress = parseInt(localStorage.getItem('information_address')!);

    this.user = JSON.parse(data!);
  }

  redirection(){
    this._router.navigate(['/my-orders']);
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

  goHome(){
    this._router.navigate(['/shop']);
  }
}
