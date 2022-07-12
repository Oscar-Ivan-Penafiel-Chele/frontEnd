import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { RestService } from 'src/app/services/rest.service';
import { Product } from 'src/app/models/product';
import { TokenService } from 'src/app/services/token.service';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { Canvas, Cell, Columns, Img, ITable, Line, PdfMakeWrapper, QR, Rect, Stack, Table, Toc, Txt  } from 'pdfmake-wrapper';
import { GeneratePdfFacturaService } from 'src/app/services/pdf/generate-pdf-factura.service';

PdfMakeWrapper.setFonts(pdfFonts);

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
  pedidosAux : any;
  products : any = [];
  subtotal : number = 0;
  iva : any = 0;
  total : number = 0;
  dataAux : any = [];

  constructor(
    private _navigate : Router,
    private _authService : AuthService,
    private _token : TokenService, 
    private _rest : RestService,
    private generatePDF : GeneratePdfFacturaService
  ) { 
    this.overlayLogout = false;
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
    const data = {
      id_user : this.user.id_user
    }

    this._rest.getOrdersCLient(data).subscribe((response) =>{
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
    this.generatePDF.generateFacturePDF(pedido);
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
}
