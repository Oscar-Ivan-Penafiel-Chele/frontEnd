import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  URL_ADDRESS : string = "https://goo.gl/maps/k1mxZVpaySL2Nf1HA";
  
  constructor() { }

  ngOnInit(): void {
  }

  numSequence( n : number) : Array<number>{
    return Array(n);
  }
}
