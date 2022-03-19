import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from 'src/app/models/order';
import { Product } from 'src/app/models/product';
import { User } from 'src/app/models/user';
import { HomeService } from 'src/app/services/home.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  user : User = {};
  a : any;
  products : Product[] = [];
  overImage : string = "assets/img/not_image.jpg";
  host : string = environment.URL;
  order : Order = {} as Order;
  priceIva : any = 0;
  priceTotalOrder : any = 0;

  constructor(
    private _router : Router,
    private _home : HomeService
  ) { }

  ngOnInit(): void {
    this.getDataClient();
    this.getProducts();
    this.getOrder();
  }

  getDataClient(){
    const data = localStorage.getItem('information_sending');
    this.user = JSON.parse(data!);
  }

  getProducts(){
    const data = localStorage.getItem('producto');
    this.products = JSON.parse(data!);
    this.products.forEach((i)=>{
      if(i.product_price_total == null || !i.product_price_total) i.product_price_total = i.product_price
    })
  }

  getOrder(){
    const data = localStorage.getItem('price_total');
    this.order = JSON.parse(data!);
    this.priceIva = (this.order.price_order_total * (12 / 100)).toFixed(2);
    this.priceTotalOrder = (this.order.price_order_total + parseFloat(this.priceIva)).toFixed(2);
  }

  nextPage() {
    this._router.navigate(['checkout/order/confirmation']);
  }

  prevPage() {
      this._router.navigate(['checkout/order/personal']);
  }
}
