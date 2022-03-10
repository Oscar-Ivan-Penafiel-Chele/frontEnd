import { Component, OnInit } from '@angular/core';
import { Egreso } from 'src/app/models/egreso';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-egresos',
  templateUrl: './egresos.component.html',
  styleUrls: ['./egresos.component.css']
})
export class EgresosComponent implements OnInit {

  egresos : Egreso[] = [];
  
  egreso : Egreso = {} as Egreso;

  loading : boolean = false;
  dialogNewEgreso : boolean = false;
  actionSelected : string = "";
  submitted : boolean = false;
  value : any;

  constructor(
    private _rest : RestService
  ) { }

  ngOnInit(): void {
    this.getEgresos();
  }

  getEgresos(){
    this._rest.getEgresos().subscribe((response : Egreso[])=>{
      this.egresos = Object.values(response);
      console.log(this.egresos);
    })
  }

  openNew(){
    this.dialogNewEgreso = true;
  }

  openModal(egreso : any){
   
  }

  hideDialog(){
    this.dialogNewEgreso = false;
  }

  saveEgreso(){

  }

}
