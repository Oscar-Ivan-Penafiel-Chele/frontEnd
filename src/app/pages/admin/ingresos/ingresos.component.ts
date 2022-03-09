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
    this.loading = true;
    this._rest.getInventory().subscribe((response : Ingreso[])=>{
      this.ingresos = Object.values(response);
      this.ingresos = this.ingresos.filter((i)=> i.inventory_movement_type == 'INGRESO')
      this.loading = false;
    })
  }

  exportPdf(){

  }
}
