import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Address, User, Product, Order } from '@models/interfaces';
import { TokenService } from 'src/app/auth/service/token.service';
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
  textResponse: string| undefined = "";
  showButtons: boolean = false;
  showButtonDynamic: boolean = false;
  url: string = "";
  iconButton: string = "";
  productsError : any[]= [];
  textOverlay: string = "Comprobando información";
  simpletText: string = "Algunos productos no cuentan con un stock disponible";
  compuestText: string = "Un producto no cuenta con un stock disponible";
  textButton: string = "";
  isButtonHome: boolean = false;
  existProducstError: boolean = false;
  isStockError: boolean = false;
  isChangePromotion: boolean = false;
  isCompleteRequest: boolean = false;
  textHeaderModal: string = "";
  first: number = 0;
  rows: number = 3;
  cont: number = 0;

  subtotalIva: number = 0;
  subtotalSinIva: number = 0;
  discount: number = 0;

  constructor(
    private _router : Router,
    private addressService : AddressUserService,
    private validationService : ValidationsService,
    private _token : TokenService,
  ) { }

  ngOnInit(): void {
    this.getDataClient();
    this.getProducts();
    this.getAddress();
    this.getIva();
  }

  getDataClient(){
    this.user = this._token.getTokenDataUser();

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
      if(i.product_offered || i.product_offered! > 0 ){
        this.discount += ((i.product_offered! / 100) * i.product_price_aux!);
      }

      if(i.product_iva == 0) {
        this.subtotalSinIva += parseFloat(i.product_price_amount!.toString());
      }else{
        this.priceIva += parseFloat(i.product__price__iva);
        total += parseFloat(i.product_price_amount);
        this.subtotalIva = total;
      }
    })

    this.order.price_order_total = (parseFloat(total.toFixed(2)) + this.subtotalSinIva - this.discount).toFixed(2);
    this.getTotalPay()
  }

  getTotalPay(){
    this.priceTotalOrder = parseFloat(this.order.price_order_total) + parseFloat(this.priceIva);
    this.priceTotalOrder = parseFloat(this.priceTotalOrder).toFixed(2);
  }

  nextPage() {
    this.showOverlay = true;
    this.loadRequest = true;
    this.validateStockProduct();
  }

  validateStockProduct(){
    let simpleText = "";
    let compuestText = "";
    let dataStock: any = {};
    const sizeProducts = this.products.length;

    this.productsError = [];

    this.products.forEach((product : Product, index)=>{
      dataStock = {
        id_product : product.id_product,
        quantity : product.product_amount_sail
      };

      this.validationService.validateStockProduct(dataStock).subscribe((response : any)=>{
        if(response.status >= 400 || response.status === 0){
          return;
        }

        if(response.message == "Stock no disponible"){
          this.productsError.push({id: product.id_product, name: response.product_name, image: product.product_image, stock : response.product_stock, quantity : product.product_amount_sail });
          this.productsError = Object.values(this.productsError);
        }

        if( index == (sizeProducts - 1)){
          this.textHeaderModal = "Productos sin stock disponible";
          simpleText = "Lo sentimos, un producto no cuenta con stock disponible!";
          compuestText = "Lo sentimos, algunos productos no cuentan con un stock disponible!";
          this.isCompleteRequest = true;
          this.isStockError = true;

          this.handleResponse(this.productsError, simpleText, compuestText);
        }
      });
    }) ;
  }

  handleResponse(productsError: any[], simpleText?:string, compuestText?: string){
    this.showButtons = true;
    this.showButtonDynamic = true;
    this.loadRequest = false;

    if(productsError.length > 0){
      this.existProducstError = true;
      this.iconResponse= "pi pi-times-circle response_error"
      this.textResponse = productsError.length == 1 ? simpleText : compuestText;
      this.url = "/checkout/cart";
      this.textButton = "Volver al carrito";
      this.iconButton = "pi pi-shopping-cart mr-2";
    }else if (productsError.length == 0 ) {
      localStorage.setItem('total',this.priceTotalOrder);
      this.iconResponse = "pi pi-check-circle response_ok";
      this.textResponse = "Validación completada con éxito!";
      this.url = "/checkout/order/confirmation";
      this.textButton = "Realizar pago";
      this.iconButton = "pi pi-credit-card mr-2";
      productsError = [];
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

  next() {
    this.cont = 0;
    if(this.isLastPage()) return;

    this.first = this.first + this.rows;
  }

  prev() {
    if(this.isFirstPage()) return;

    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    // if(this.cont === Math.floor(this.products.length/this.rows)) return true;

    // this.cont ++;
    return false;
  }

  isFirstPage(): boolean {
    return this.products ? this.first === 0 : true;
  }
}
