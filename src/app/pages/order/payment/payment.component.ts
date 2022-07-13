import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from 'src/app/models/order';
import { Product } from 'src/app/models/product';
import { Address, User } from 'src/app/models/user';
import { AddressUserService } from 'src/app/services/address-user.service';
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

  constructor(
    private _router : Router,
    private addressService : AddressUserService,
  ) { }

  ngOnInit(): void {
    this.getDataClient();
    this.getProducts();
    this.getAddress();
  }

  getDataClient(){
    const data = localStorage.getItem('information_sending');
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
    localStorage.setItem('total',this.priceTotalOrder);
    this._router.navigate(['checkout/order/confirmation']);
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
}
