import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-service-home',
  templateUrl: './service-home.component.html',
  styleUrls: ['./service-home.component.css']
})
export class ServiceHomeComponent implements OnInit {
  list_service: string[] = [
    'Pedidos online',
    'Copia de llaves',
    'Banco de herramientas',
    'Instrucciones online',
    'Entrega a domicilio'
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
