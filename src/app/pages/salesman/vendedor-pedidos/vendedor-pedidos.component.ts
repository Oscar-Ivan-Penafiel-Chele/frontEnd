import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';
import {ConfirmationService, ConfirmEventType, MessageService} from 'primeng/api';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { Canvas, Cell, Columns, Img, ITable, Line, PdfMakeWrapper, QR, Rect, Stack, Table, Toc, Txt  } from 'pdfmake-wrapper';

PdfMakeWrapper.setFonts(pdfFonts);

@Component({
  selector: 'app-vendedor-pedidos',
  templateUrl: './vendedor-pedidos.component.html',
  styleUrls: ['./vendedor-pedidos.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class VendedorPedidosComponent implements OnInit {

  pedidos : any; 
  loading : boolean = false;
  products: any;
  pedidosAux : any;
  dataAux : any;
  subtotal : any;
  iva : any;
  total : any;
  
  constructor(
    private _rest : RestService,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getPedidos();
  }

  getPedidos(){
    this.loading = true;
    this._rest.getPendingOrders().subscribe((response) =>{
      this.groupOrderByIdOrder(response);
    })
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

    this.loading = false;
  }

  complete(pedido : any){
    const data = {
      id_order : pedido.orders[0].i.id_order
    }

    this.confirmationService.confirm({
      message: `¿Está seguro de completar el pedido de: ${pedido.orders[0].i.order.user.user_name} ${pedido.orders[0].i.order.user.user_lastName}?`,
      header: 'Completar Pedido',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel : "Confirmar",
      accept: () => {
          this._rest.changeStateOrder(data).subscribe((response)=>{
            if(response.status == 200 || response.message == "Orden completada"){
              this.messageService.add({severity:'success', summary:'Completado', detail:`El pedido de : ${pedido.orders[0].i.order.user.user_name} ${pedido.orders[0].i.order.user.user_lastName} ha sido completado`});
            }else if(response.status == 500 && response.message == "Ocurrio un error interno en el servidor"){
              this.messageService.add({severity:'error', summary:'Error', detail:`${response.message}`});
            }else if(response.status == 500){
              console.log(response.message);
            }else if(response.status == 401){
              console.log(response.message);
            }

            this.getPedidos();
          })
      }
  });
  }

  async viewOrder(pedido : any){
    await this.extractData(pedido);
    await this.getDetailsSailTotal();
    await this.getPDF();
  }

  async extractData(pedido : any){
    this.products = [];
    this.pedidosAux = pedido.orders.map((item : any)=>{
      this.products.push({producto: item.i.order_detail.producto, order_detail_quantity: item.i.order_detail.order_detail_quantity, order_detail_total : item.i.order_detail.order_detail_total, order_detail_discount : item.i.order_detail.order_detail_discount})
      return {voucher : item.i.order.voucher_number, create_date: item.i.create_date, name_user: item.i.order.user.user_name, lastName_user: item.i.order.user.user_lastName, address: item.i.order.user.user_address, phone: item.i.order.user.user_phone, document: item.i.order.user.user_document, products : [], email : item.i.order.user.email}
    });
  }

  async getDetailsSailTotal(){
    this.dataAux = [];
    this.products.map((i : any)=>{
      this.dataAux.push(i.order_detail_total);
    })
    
    this.subtotal = this.dataAux.reduce((i : any,j : any)=>{
      return parseFloat(i) + parseFloat(j);
    })

    this.iva = (this.subtotal * (12/100));
    this.total = (Number(this.subtotal) + Number(this.iva));
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
              new Txt('RUC:').absolutePosition(310,50).bold().fontSize(8).end,
              new Txt(' 0930421466').absolutePosition(330,50).fontSize(8).end,
            ]).end,
            new Txt('FACTURA').absolutePosition(310,70).bold().fontSize(8).end,
            new Columns([
              new Txt('No:').absolutePosition(310,90).bold().fontSize(8).end,
              new Txt(`${this.pedidosAux[0].voucher}`).absolutePosition(330,90).fontSize(8).end,
            ]).end,
            new Columns([
              new Txt('FECHA DE AUTORIZACIÓN:').bold().absolutePosition(310,110).fontSize(8).end,
              new Txt(`${this.pedidosAux[0].create_date}`).absolutePosition(410,110).fontSize(8).end,
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
          new Txt(`${this.pedidosAux[0].name_user} ${this.pedidosAux[0].lastName_user}`).absolutePosition(210,190).fontSize(8).end,
        ]).end,
        new Columns([
          new Txt('DIRECCIÓN:').absolutePosition(50,200).fontSize(8).bold().end,
          new Txt(`${this.pedidosAux[0].address}`).absolutePosition(100,200).fontSize(8).end,
        ]).end,
        new Columns([
          new Txt('TELÉFONO:').absolutePosition(310,200).fontSize(8).bold().end,
          new Txt(`${this.pedidosAux[0].phone}`).absolutePosition(360,200).fontSize(8).end,
        ]).end,
        new Columns([
          new Txt('FECHA DE EMISIÓN:').absolutePosition(50,210).fontSize(8).bold().end,
          new Txt(`${this.pedidosAux[0].create_date}`).absolutePosition(130,210).fontSize(8).end,
        ]).end,
        new Txt('IDENTIFICACIÓN:').absolutePosition(310,210).fontSize(8).bold().end,
        new Txt(`${this.pedidosAux[0].document}`).absolutePosition(380,210).fontSize(8).end,
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
            new Txt('Precio Unitario (USD)').alignment('center').bold().end,
            new Txt('Descuento (%)').alignment('center').bold().end,
            new Txt('Precio Total (USD)').alignment('center').bold().end,
        ],
    ]).widths([45,45,30,174,50,50,50]).bold().fontSize(8).end
    );

    // this.providersAux.sort(this.sortProvider)
     this.products.forEach((item : any)=>{
        pdf.add(
            new Table([
                [
                  new Txt(`${item.producto.product_code}`).alignment('center').end,
                  new Txt(`${item.producto.product_code}`).alignment('center').end,
                  new Txt(`${(item.order_detail_quantity).toString().split('.')[0]}`).alignment('center').end,
                  new Txt(`${item.producto.product_name}`).alignment('center').end,
                  new Txt(`$ ${item.producto.product_price}`).alignment('center').end,
                  new Txt(`${(item.order_detail_discount).toString().split('.')[0]}%`).alignment('center').end,
                  new Txt(`$ ${item.order_detail_total}`).alignment('center').end,
                ],
            ]).widths([45,45,30,174,50,50,50]).fontSize(8).end
        );
     })
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
                  new Txt(`${this.pedidosAux[0].email}`).width('*').end,
                ]).end,
              ]).margin([0,10,0,24]).end,
            ]
          ]).widths([240]).fontSize(8).end,

          new Table([
            [ 
              new Txt('SUBTOTAL').fontSize(8).alignment('left').bold().end,
              new Txt(`$ ${this.subtotal}`).fontSize(8).alignment('right').end,
            ],
            [
              new Txt('IVA 0%').fontSize(8).alignment('left').bold().end,
              new Txt(`$ 0.00`).fontSize(8).alignment('right').end,
            ],
            [
              new Txt('IVA 12%').fontSize(8).alignment('left').bold().end,
              new Txt(`$ ${(this.iva).toFixed(2)}`).fontSize(8).alignment('right').end,
            ],
            [
              new Txt('DESCUENTO 0%').fontSize(8).alignment('left').bold().end,
              new Txt('$ 0.00').fontSize(8).alignment('right').end,
            ],
            [
              new Txt('TOTAL A PAGAR').fontSize(8).alignment('left').bold().end,
              new Txt(`$ ${(this.total).toFixed(2)}`).fontSize(8).alignment('right').end,
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
          new Txt('Valor (USD)').fontSize(8).alignment('center').bold().end,
        ],
        [
          new Txt('SIN UTILIZACIÓN DEL SISTEMA FINANCIERO').fontSize(8).end,
          new Txt(`$ ${(this.total).toFixed(2)}`).fontSize(8).alignment('center').end,
        ]
      ]).widths([150,80]).end
    );
    
    pdf.footer((currentPage : any, pageCount : any)=>{
      return new Txt(`Pág. ${currentPage}/${pageCount}`).color('#3f3f3f').margin([20,5,40,20]).alignment('right').fontSize(7).end;
    });
    pdf.create().open();  
  }
}
