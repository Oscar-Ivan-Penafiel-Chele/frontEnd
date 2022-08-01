import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Address, User, Product, Order } from '@models/interfaces';
import { AddressUserService } from 'src/app/pages/admin/other/address/service/address-user.service';
import { ValidationsService } from 'src/app/shared/services/validations/validations.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  user : User = {};
  products : Product[] = [];
  overImage : string = "assets/img/not_image.jpg";
  host : string = environment.URL;
  order : Order = {} as Order;
  priceIva : any = 0;
  priceTotalOrder : any = 0;
  typeDocument : string = "";
  addressOrder : string = "";
  iva : string = "";

  showOverlay: boolean = false;
  loadRequest: boolean = false;
  iconResponse : string = "";
  textResponse: string = "";
  showButtons: boolean = false;
  showButtonDynamic: boolean = false;
  url: string = "";
  iconButton: string = "";
  productsError : any[]= [];
  textOverlay: string = "";
  simpletText: string = "Los productos no cuentan con un stock disponible";
  compuestText: string = "El producto no cuenta con un stock disponible";
  textButton: string = "";

  constructor(
    private _router : Router,
    private addressService : AddressUserService,
    private validationService : ValidationsService
  ) { }

  ngOnInit(): void {
    this.getDataClient();
    this.getProducts();
    this.getAddress();
    this.getIva();
  }

  getDataClient(){
    const data = localStorage.getItem('user');
    this.user = JSON.parse(data!);

    this.getTypeDocument(this.user.id_identification_type!);
  }

  getTypeDocument(idTypeDocument : number){
    switch (idTypeDocument) {
      case 1: this.typeDocument = "Cédula"
        break;
      case 2: this.typeDocument = "Pasaporte"
        break;
      case 3: this.typeDocument = "RUC"
        break;
      default:
        break;
    }
  }

  getProducts(){
    let total = 0;
    const data = localStorage.getItem('producto');

    this.products = JSON.parse(data!);

    this.products.forEach((i)=>{
      this.priceIva += parseFloat(i.product__price__iva);
      total += parseFloat(i.product_price_amount);
    })

    this.order.price_order_total = total.toFixed(2);
    this.getTotalPay()
  }

  getTotalPay(){
    const data = localStorage.getItem('total');

    this.priceTotalOrder = parseFloat(data!).toFixed(2);
  }

  nextPage() {
    let data: any = {};
    const sizeProducts = this.products.length;

    this.products.forEach((product: Product, index)=>{
      data = {
        id_product : product.id_product,
        quantity : product.product_amount_sail
      };
      
      this.showOverlay = true;
      this.loadRequest = true;
      this.textOverlay = "Comprobando stock disponible";
      
      this.validationService.validateStockProduct(data).subscribe((response : any)=>{
        if(response.message == "Stock no disponible"){
          this.productsError.push(response.product_stock);
        }

        if( index == (sizeProducts - 1)){
          this.handleResponse();
        }
      });
    })
  }

  handleResponse(){
    this.showButtons = true;
    this.showButtonDynamic = true;
    this.loadRequest = false;

    if(this.productsError.length > 0){
      this.iconResponse= "pi pi-times-circle response_error"
      this.textResponse = this.products.length == 1 ? this.simpletText : this.compuestText;
      this.url = "/checkout/cart";
      this.textButton = "Ir al carrito";
      this.iconButton = "pi pi-shopping-bag mr-2";
    }else if (this.productsError.length == 0 ) {
      // localStorage.setItem('total',this.priceTotalOrder);
      this.iconResponse = "pi pi-check-circle response_ok";
      this.textResponse = "Todos los productos cuentan con un stock disponible!"
      this.url = "/checkout/order/confirmation";
      this.textButton = "Realizar pago";
      this.iconButton = "pi pi-credit-card mr-2";
    }

  }

  prevPage() {
      this._router.navigate(['checkout/order/personal']);
  }

  getAddress(){
    const data = localStorage.getItem('information_address');

    this.addressService.getAddressByID(parseInt(data!)).subscribe((response : Address) =>{
      this.addressOrder = response.user_address;
    })
  }

  getIva(){
    this.iva = localStorage.getItem('iva')!;
  }
}
