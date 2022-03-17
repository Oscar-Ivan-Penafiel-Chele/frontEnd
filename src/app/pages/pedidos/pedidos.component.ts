import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { RestService } from 'src/app/services/rest.service';
import { TokenService } from 'src/app/services/token.service';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { Canvas, Cell, Columns, Img, ITable, Line, PdfMakeWrapper, QR, Stack, Table, Toc, Txt  } from 'pdfmake-wrapper';

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
  
  constructor(
    private _navigate : Router,
    private _authService : AuthService,
    private _token : TokenService, 
    private _rest : RestService,
  ) { 
    this.overlayLogout = false;
  }

  ngOnInit(): void {
    this.pedidos = [
      {orden : 'a' , fecha: 'a', total : 'a', estado : 'a', observacion : 'a'}
    ]
    this.getData();
  }

  async getData(){
    await this.isLog();
  }

  async isLog(){
    if(!this._token.getTokenDataUser()){
      return ;
    }

    this.user = JSON.parse(this._token.getTokenDataUser()!);
    this.isLogged = true;
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
    
    // if(menu?.classList.contains("display")){
    //  content?.addEventListener('click',function(e){
    //      let isClickInside = menu.contains(e.target as Node);

    //      if(!isClickInside){
    //        console.log("Fuera");
    //        hamburger?.classList.remove("is-active"); 
    //        menu.classList.remove('display');  
    //      }
    //  })
    // }
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

  async viewPDF(pedido : any){
    console.log(pedido);
    // const fecha = new Date();
    // const pdf = new PdfMakeWrapper();
    // pdf.info({
    //     title: 'PDF Pedido',
    //     author: '@Yebba',
    //     subject: 'Mostrar los pedidos',
    // });
    // pdf.pageSize('A4');
    // pdf.pageOrientation('portrait'); // 'portrait'
    // pdf.add(
    //   new Stack([
    //     new Columns([
    //       await new Img('assets/img/log_app_pdf.svg').width(100).build(),
    //       new Columns([
    //         new Stack([
    //           new Columns([ 
    //             new Txt('Detalles del Pedido').fontSize(14).bold().end,
    //           ]).color('#3f3f3f').end,
    //           new Columns([ 
    //             new Txt(' \n\n').fontSize(11).end,
    //           ]).color('#3f3f3f').end,
    //           new Columns([ 
    //             new Txt('').alignment('right').width('*').bold().end,
    //             new Txt('Usuario: ').alignment('right').width('*').bold().end,
    //             new Txt(`${this.user.user_name} ${this.user.user_lastName}`).width(60).alignment('right').end,
    //             new Txt('Fecha: ').alignment('right').width(40).bold().end,
    //             new Txt(`${fecha.getFullYear()}/${(fecha.getMonth()+1) < 10 ? '0'+(fecha.getMonth()+1) : (fecha.getMonth()+1)}/${fecha.getDate() < 10 ? '0'+fecha.getDate() : fecha.getDate()} `).width(55).alignment('right').end,
    //             new Txt('Hora:').alignment('right').width(30).bold().end,
    //             new Txt(`${fecha.getHours() < 10 ? '0'+fecha.getHours() : fecha.getHours()}:${fecha.getMinutes() < 10 ? '0'+fecha.getMinutes() : fecha.getMinutes()} \n\n`).width(30).alignment('right').end,
    //           ]).end,
    //         ]).width('*').color('#3f3f3f').alignment('right').fontSize(10).end
    //       ]).end
    //     ]).end
    //   ]).end
    // );
    // pdf.add(
    //   '\n'
    // )
    // pdf.add(
    //   new Columns([
    //     new Canvas([
    //         new Line([0,0], [755,0]).lineColor('#ccc').end
    //     ]).end,
    //   ]).width('*').end
    // );
    // pdf.add(
    //   '\n\n'
    // )
    // pdf.add(
    //     new Txt('Información del Pedido').alignment('center').bold().fontSize(12).margin(10).end
    // );   
    // pdf.add(
    //   new Table([
    //     [
    //         new Txt('Cod.').bold().end,
    //         new Txt('Producto').bold().end,
    //         new Txt('Precio').bold().end,
    //         new Txt('Descuento').bold().end,
    //         new Txt('Cantidad').bold().end,
    //         new Txt('Precio Total').bold().end,
    //     ],
    // ]).widths([40,120,80,80,60,100]).fontSize(10).end
    // );

    // this.providersAux.forEach((item)=>{
    //     pdf.add(
    //         new Table([
    //             [
    //               new Txt(String(item.id_provider!)).end,
    //               new Txt(item.provider_name!).end,
    //               new Txt(item.provider_email!).end,
    //               new Txt(item.provider_address!).end,
    //               new Txt(item.provider_landline!).end,
    //               new Txt(item.provider_phone!).end,
    //               new Txt(String(item.provider_response_time_day)+ ' Días y ' + String(item.provider_response_time_hour) + ' Horas').end,
    //               new Txt(item.provider_status == 1 ? 'Activo' : 'Inactivo').end,
    //             ]
    //         ]).widths([40,120,120,80,60,100,80,60]).fontSize(10).end
    //     );
    // })
    // pdf.footer((currentPage : any, pageCount : any)=>{
    //   return new Txt(`Pág. ${currentPage}/${pageCount}`).color('#3f3f3f').margin([20,5,40,20]).alignment('right').fontSize(10).end;
    // });
    // pdf.create().open();  
  }
}
