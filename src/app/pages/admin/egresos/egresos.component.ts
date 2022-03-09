import { Component, OnInit } from '@angular/core';
import { Egreso } from 'src/app/models/egreso';

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

  constructor() { }

  ngOnInit(): void {
  
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
