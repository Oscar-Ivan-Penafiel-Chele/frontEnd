import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  a : any;

  constructor(
    private _router : Router
  ) { }

  ngOnInit(): void {
  }

  nextPage() {
    this._router.navigate(['checkout/order/confirmation']);
  }

  prevPage() {
      this._router.navigate(['checkout/order/personal']);
  }
}
