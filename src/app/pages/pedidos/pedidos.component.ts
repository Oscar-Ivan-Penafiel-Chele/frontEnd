import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { RestService } from 'src/app/services/rest.service';
import { TokenService } from 'src/app/services/token.service';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { Canvas, Cell, Columns, Img, ITable, Line, PdfMakeWrapper, QR, Rect, Stack, Table, Toc, Txt  } from 'pdfmake-wrapper';

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

  constructor(
    private _navigate : Router,
    private _authService : AuthService,
    private _token : TokenService, 
    private _rest : RestService,
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
      this.pedidos = response;
      console.log(response);
    });
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
    await this.extractData(pedido);
    await this.getPDF();
  }

  async extractData(pedido : any){
    this.pedidosAux = pedido.map((i : any)=>{
      return {voucher : i.order.voucher_number, create_date: i.create_date, name_user: i.order.user.user_name, lastName_user: i.order.user.user_lastName, address: i.order.user.user_address, phone: i.order.user.user_phone, document: i.order.user.user_document, products : i.order_detail.producto, email : i.order.user.email}
    });
  }

  async getPDF(){
    const fecha = new Date();
    const pdf = new PdfMakeWrapper();
    pdf.info({
        title: 'PDF Proveedores',
        author: '@Yebba',
        subject: 'Mostrar los proveedores de la ferretería',
    });
    pdf.pageSize('A4');
    pdf.pageOrientation('portrait'); // 'portrait'
    pdf.add(
      new Stack([
        new Columns([
          new Stack([
            new Columns([
              await new Img('assets/img/log_app_pdf.svg').margin([80,0,0,0]).width(100).build(),
            ]).end,
            new Columns([
              new Stack([
                new Canvas([
                  new Rect([0, 0], [250, 60]).end,
                ]).width('*').end,
                new Columns([
                  new Txt('EL DESCANSO').absolutePosition(120,110).bold().end,
                  new Txt(' Durán - Ecuador').absolutePosition(50,125).fontSize(8).end,
                  new Txt('Dirección Matriz:').absolutePosition(50,140).fontSize(8).bold().end,
                  new Txt('Primavera 2').absolutePosition(120,140).fontSize(8).end,
                ]).end,
              ]).end
            ]).margin([0,10,0,0]).end,
          ]).end,
          new Stack([
            new Canvas([
                new Rect([0, 0], [250, 125]).end,
            ]).end,
            new Columns([
              new Txt('RUC:').absolutePosition(310,50).fontSize(8).end,
              new Txt(' 0930421466').absolutePosition(330,50).fontSize(8).end,
            ]).end,
            new Txt('FACTURA').absolutePosition(310,70).fontSize(8).end,
            new Columns([
              new Txt('No:').absolutePosition(310,90).fontSize(8).end,
              new Txt(' 0930421466').absolutePosition(330,90).fontSize(8).end,
            ]).end,
            new Columns([
              new Txt('FECHA DE AUTORIZACIÓN:').absolutePosition(310,110).fontSize(8).end,
              new Txt('2022-03-17').absolutePosition(410,110).fontSize(8).end,
            ]).end,
          ]).end
          
        ]).end
      ]).end
    );

    pdf.add(
      '\n'
    )
    
    pdf.add(new Stack([
        new Canvas([
          new Rect([0, 0], [508, 55 ]).end,
        ]).end,
        new Columns([
          new Txt('RAZÓN SOCIAL / NOMBRES Y APELLIDOS:').absolutePosition(50,190).fontSize(8).bold().end,
          new Txt(' 0930421466').absolutePosition(210,190).fontSize(8).end,
        ]).end,
        new Columns([
          new Txt('DIRECCIÓN:').absolutePosition(50,200).fontSize(8).bold().end,
          new Txt(' 0930421466').absolutePosition(100,200).fontSize(8).end,
        ]).end,
        new Columns([
          new Txt('TELÉFONO:').absolutePosition(310,200).fontSize(8).bold().end,
          new Txt(' 0930421466').absolutePosition(360,200).fontSize(8).end,
        ]).end,
        new Columns([
          new Txt('FECHA DE EMISIÓN:').absolutePosition(50,210).fontSize(8).bold().end,
          new Txt(' 0930421466').absolutePosition(130,210).fontSize(8).end,
        ]).end,
        new Txt('IDENTIFICACIÓN:').absolutePosition(310,210).fontSize(8).bold().end,
        new Txt(' 0930421466').absolutePosition(380,210).fontSize(8).end,
      ]).end  
    );

    pdf.add(
      '\n'
    )
    pdf.add(
      new Table([
        [
            new Txt('Cód. Principal').alignment('center').bold().end,
            new Txt('Cód. Auxiliar').alignment('center').bold().end,
            new Txt('Cant.').alignment('center').bold().end,
            new Txt('Descripción').alignment('center').bold().end,
            new Txt('Precio Unitario').alignment('center').bold().end,
            new Txt('Descuento').alignment('center').bold().end,
            new Txt('Precio Total').alignment('center').bold().end,
        ],
    ]).widths([45,45,30,174,50,50,50]).bold().fontSize(8).end
    );

    // this.providersAux.sort(this.sortProvider)
    // this.providersAux.forEach((item)=>{
        pdf.add(
            new Table([
                [
                  new Txt('a').alignment('center').end,
                  new Txt('a').alignment('center').end,
                  new Txt('a').alignment('center').end,
                  new Txt('a').alignment('center').end,
                  new Txt('a').alignment('center').end,
                  new Txt('a').alignment('center').end,
                  new Txt('a').alignment('center').end,
                ],
            ]).widths([45,45,30,174,50,50,50]).fontSize(8).end
        );
    // })
    pdf.add(
      '\n'
    )

    pdf.add(
      new Stack([
        new Columns([
          new Table([
            [ new Txt('INFORMACIÓN ADICIONAL').alignment('center').bold().end,],
            [
              new Stack([
                new Columns([
                  new Txt('Correo de Empresa: ').width(80).end,
                  new Txt('el-descanso@gmail.com').width('*').end,
                ]).end,
                new Columns([
                  new Txt('Correo de Cliente: ').width(80).end,
                  new Txt('oscar@gmail.com').width('*').end,
                ]).end,
              ]).margin([0,10,0,24]).end,
            ]
          ]).widths([240]).fontSize(8).end,

          new Table([
            [ 
              new Txt('SUBTOTAL').fontSize(8).alignment('left').bold().end,
              new Txt('A').fontSize(8).alignment('right').end,
            ],
            [
              new Txt('IVA 0%').fontSize(8).alignment('left').bold().end,
              new Txt('A').fontSize(8).alignment('right').end,
            ],
            [
              new Txt('IVA 12%').fontSize(8).alignment('left').bold().end,
              new Txt('A').fontSize(8).alignment('right').end,
            ],
            [
              new Txt('DESCUENTO 0%').fontSize(8).alignment('left').bold().end,
              new Txt('A').fontSize(8).alignment('right').end,
            ],
            [
              new Txt('TOTAL A PAGAR').fontSize(8).alignment('left').bold().end,
              new Txt('A').fontSize(8).alignment('right').end,
            ]

          ]).widths([116,115]).fontSize(8).end,
        ]).end,
      ]).end,
    ); 
    
    pdf.add(
      '\n'
    )

    pdf.add(
      new Table([
        [ 
          new Txt('Forma de Pago').fontSize(8).alignment('center').bold().end,
          new Txt('Valor').fontSize(8).alignment('center').bold().end,
        ],
        [
          new Txt('SIN UTILIZACIÓN DEL SISTEMA FINANCIERO').fontSize(8).end,
          new Txt('Valor').fontSize(8).alignment('center').end,
        ]
      ]).widths([150,80]).end
    );
    
    pdf.footer((currentPage : any, pageCount : any)=>{
      return new Txt(`Pág. ${currentPage}/${pageCount}`).color('#3f3f3f').margin([20,5,40,20]).alignment('right').fontSize(10).end;
    });
    pdf.create().open();  
  }
}
