import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MessageService, Message} from 'primeng/api';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { environment } from 'src/environments/environment.prod';
import { User, Order, Product } from '@models/interfaces';
import { ConfirmationOrderService } from '../service/confirmation.service';
import { TokenService } from 'src/app/auth/service/token.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css'],
  providers: [MessageService]
})
export class ConfirmationComponent implements OnInit {

  public payPalConfig?: IPayPalConfig;
  user : User = {};
  clientID : string = environment.CLIENT_ID_PAYPAL;
  products : Product[] = [];
  items_products : any[] = [];
  order : Order = {} as Order;
  showOverlay : boolean = false;
  idAddress : number = 0;
  loadRequest : boolean = false;
  iconResponse : string = "";
  iconOkResponse : string = "pi pi-check-circle response_ok";
  iconErrorResponse : string = "pi pi-times-circle response_error";
  textResponse : string ="";
  showButtonDynamic : boolean = false;
  textOverlay : string = "";
  showButtons : boolean = false;
  url : string = "";
  iconButton: string ="";
  textButton: string = "";
  typePay: string= "";

  constructor(
    private _router : Router,
    private messageService: MessageService,
    private confirmationOrderService : ConfirmationOrderService,
    private _token : TokenService,
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
      this.loadRequest = true;
      this.textOverlay = "Realizando Pago"
      actions.order.get().then((details : any) => {
        //console.log('onApprove - you can get full order details inside onApprove: ', details);
      });
    },
    onClientAuthorization: (data) => {
      // console.log(data);
      if(data.status === "COMPLETED"){
        this.loadRequest = false;
        this.iconResponse = this.iconOkResponse;
        this.textResponse = "Pago realizado con éxito!";
        this.showButtons = false;

        setTimeout(() => {
          this.loadRequest = true;
          this.textOverlay = "Generando pedido"
          this.completProcess();
        }, 2000);
      }
    },
    onError: err => {
      this.loadRequest = false;
      this.iconResponse = this.iconErrorResponse;
      this.textResponse = "No se pudo realizar el pago, verifique el estado de su cuenta";
      this.showButtons = true;
      this.showButtonDynamic = false;
      
      //console.log('OnError', err);
    },
    onClick: (data) => {
      this.typePay = data.fundingSource;
    }
  };
  }

  async completProcess(){
    await this.addSail();
  }

  async addSail(){
    // agregar campo de tipo de pago
    const data = {
      id_user : this.user.id_user,
      order_price_total : this.order.price_order_total,
      products : this.products,
      id_address : this.idAddress,
      address_reference : this.user.user_address_reference
    }

    this.confirmationOrderService.createOrder(data).subscribe((response : any)=>{
      this.loadRequest = false;
      this.showButtons = true;

      if(response.status == 200 || response.message == "Guardado con exito"){
        this.confirmationOrderService.sendEmail(this.user.email!).subscribe((r : any)=>{
          if(r.status >= 400){
            console.log(r);
          }
        })
        this.iconResponse = this.iconOkResponse;
        this.textResponse = "Pedido realizado con éxito!";
        this.url = "/my-orders";
        this.iconButton = "pi pi-shopping-bag mr-2";
        this.textButton = "Ir a Pedidos";
        this.showButtonDynamic = true;


        localStorage.removeItem('information_address');
        localStorage.removeItem('subtotal');
        localStorage.removeItem('total');
        localStorage.removeItem('producto');
        localStorage.removeItem('iva');

      }else if(response.status == 500 || response.status == 400){
        this.iconResponse = this.iconErrorResponse;
        this.textResponse = "Ocurrio un problema en el servidor";
        this.showButtonDynamic = false;
      }
    });
  }

  async getDataProfile(){
    this.idAddress = parseInt(localStorage.getItem('information_address')!);
    this.user = this._token.getTokenDataUser();
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
  }

  goHome(){
    this._router.navigate(['/shop']);
  }
}