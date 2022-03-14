import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {

  submitted : boolean = false;
  a : any ;

  constructor(
    private _navigator : Router
  ) { }

  ngOnInit(): void {
  }



  nextPage() {
    this._navigator.navigate(['checkout/order/payment']);
  }
}
