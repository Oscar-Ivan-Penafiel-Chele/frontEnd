import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

  a : any;

  constructor(
    private _router : Router,
    private _home : HomeService
  ) { }

  ngOnInit(): void {
  }

  prevPage() {
    this._router.navigate(['checkout/order/payment']);
  }

  complete(){
    
  }
}
