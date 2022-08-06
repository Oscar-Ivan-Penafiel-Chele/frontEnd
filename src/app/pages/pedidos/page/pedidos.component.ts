import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@models/interfaces';
import { AuthService } from 'src/app/auth/service/auth.service';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { PdfMakeWrapper} from 'pdfmake-wrapper';
import { TokenService } from 'src/app/auth/service/token.service';
import { PedidosService } from '../service/pedidos.service';
import { GeneratePdfFacturaService } from 'src/app/shared/services/pdfs/generate-pdf-factura.service';

PdfMakeWrapper.setFonts(pdfFonts);

export interface IPedido{
  id_order : number,
  create_date : string,
  total : number,
  status : string,
  pedido : any
}

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {

  user : User = {};
  isLogged?: boolean = false;
  overlayLogout : boolean;
  pedidos : any;
  dataAux : IPedido[] = [];
  isLoading : boolean = true;
  options : any [] = [];
  dataFilter: IPedido[] = [];
  selectedOptionFilter : any;

  constructor(
    private _navigate : Router,
    private _authService : AuthService,
    private _token : TokenService, 
    private pedidoService : PedidosService,
    private generatePDF : GeneratePdfFacturaService
  ) { 
    this.overlayLogout = false;
    this.options = [
      {id: '1', name : 'Completada'},
      {id: '2', name : 'Pendiente'},
      {id: '3', name : 'Todos'},
    ]
  }

  ngOnInit(): void {
    this.getData();
  }

  async getData(){
    await this.isLog();
    await this.getOrdersClient();
  }

  async isLog(){
    if(!this._token.getTokenDataUser()){
      return ;
    }

    this.user = JSON.parse(this._token.getTokenDataUser()!);
    this.isLogged = true;
  }

  async getOrdersClient(){
    this.selectedOptionFilter = 3;
    this.isLoading = true;
    const data = {
      id_user : this.user.id_user
    }

    this.pedidoService.getOrdersCLient(data).subscribe((response) =>{
      this.groupOrderByIdOrder(response);
    });
  }

  groupOrderByIdOrder(response : any){
    let data : any = {};

    response.forEach((i : any)=>{
      if(!data.hasOwnProperty(i.id_order)){
        data[i.id_order] = {
          orders : []
        }
      }

      data[i.id_order].orders.push({i});
    }); 

    this.pedidos = Object.values(data)

    this.createInterfaceTable(this.pedidos)
  }

  createInterfaceTable(pedidos : any[]){
    pedidos.forEach((pedido : any) =>{
      this.dataAux.push(
        {
          id_order : pedido.orders[0].i.order.id_order,
          create_date : pedido.orders[0].i.create_date,
          total : pedido.orders[0].i.order.order_price_total,
          status : pedido.orders[0].i.order.order_status.order_status_description,
          pedido : pedido.orders
        }
      );
    });
    this.isLoading = false;
    this.dataAux = Object.values(this.dataAux);
    this.dataFilter = this.dataAux;
  }


  goCart(){
    this._navigate.navigate(["/checkout/cart"]);
  }

  displayOptions(){
    const menu = document.querySelector('.nav__user');
    const menuOptions = document.querySelector('.nav__user__option');

    if(menuOptions?.classList.contains('isActiveNavOption')){
      menu?.classList.add('isActiveNavUser');
      menuOptions.classList.remove('isActiveNavOption');
    }else{
      menu?.classList.remove('isActiveNavUser');
      menuOptions?.classList.add('isActiveNavOption');
    }
  }
  
  isActive(){
    const hamburger =  document.querySelector('.hamburger');
    const menu = document.querySelector('.nav__menu');
    const content = document.querySelector('.content-main');

    hamburger?.classList.toggle('is-active');
    menu?.classList.toggle('display');
  }

  logOut(){
    this.overlayLogout = true;
    this._authService.logout(this.user.id_user!)
      .subscribe((response)=>{
        if(response.status == 200 || response.message === "Sesión cerrada con éxito"){
          this._token.removeToken();
          window.location.href = '/shop';
      }
    });
  }

  viewPDF(pedido : any){
    this.generatePDF.generateFacturePDF({orders : pedido});
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event : any) {
      if(!this.getKeepSession()){
          localStorage.clear();
      }
  }

  getKeepSession(){
    const data = localStorage.getItem('keepSession');

    if(data!.toString() == "true"){
        return true;
    }else{
        return false;
    }
  }

  
  change($event : any){
    let filter = 0;

    filter = $event.path[2].attributes[1].value

    if(filter == 1){
      this.dataAux = this.dataFilter.filter( i => i.status == 'Completada')
    }else if( filter == 2){
      this.dataAux = this.dataFilter.filter( i => i.status == 'Pendiente')
    }else if(filter == 3){
      this.dataAux = this.dataFilter;
    }
  }
}
