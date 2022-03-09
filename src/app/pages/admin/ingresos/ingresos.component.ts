import { Component, OnInit } from '@angular/core';
import { Ingreso } from 'src/app/models/ingreso';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.css']
})
export class IngresosComponent implements OnInit {

  loading : boolean = false;

  ingresos : Ingreso[] = [];

  constructor(
    private _rest : RestService
  ) { }

  ngOnInit(): void {
    this.getIngresos();
  }

  getIngresos(){
    this._rest.getIngresos().subscribe((response : Ingreso[])=>{
      this.ingresos = Object.values(response);
    })
  }

  exportPdf(){

  }
}
