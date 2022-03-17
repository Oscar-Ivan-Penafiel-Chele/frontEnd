import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vendedor-pedidos',
  templateUrl: './vendedor-pedidos.component.html',
  styleUrls: ['./vendedor-pedidos.component.css']
})
export class VendedorPedidosComponent implements OnInit {

  pedidos : any; 
  
  constructor() { }

  ngOnInit(): void {
  }

}
