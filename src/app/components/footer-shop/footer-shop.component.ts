import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-shop',
  templateUrl: './footer-shop.component.html',
  styleUrls: ['./footer-shop.component.css']
})
export class FooterShopComponent implements OnInit {

  URL_ADDRESS : string = "https://goo.gl/maps/k1mxZVpaySL2Nf1HA";


  constructor() { }

  ngOnInit(): void {
  }

  numSequence( n : number) : Array<number>{
    return Array(n);
  }

}
