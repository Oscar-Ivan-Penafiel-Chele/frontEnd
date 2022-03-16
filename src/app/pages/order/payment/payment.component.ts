import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  user : User = {};
  a : any;

  constructor(
    private _router : Router,
    private _home : HomeService
  ) { }

  ngOnInit(): void {
    this.getDataClient();
  }

  getDataClient(){
    this.user = this._home.getUser();
    console.log(this.user);
  }

  nextPage() {
    this._router.navigate(['checkout/order/confirmation']);
  }

  prevPage() {
      this._router.navigate(['checkout/order/personal']);
  }
}
