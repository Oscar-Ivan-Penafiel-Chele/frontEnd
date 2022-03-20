import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Sail } from 'src/app/models/sail';
import { User } from 'src/app/models/user';
import { RestService } from 'src/app/services/rest.service';
import { TokenService } from 'src/app/services/token.service';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { Canvas, Cell, Columns, Img, ITable, Line, PdfMakeWrapper, QR, Rect, Stack, Table, Toc, Txt  } from 'pdfmake-wrapper';

PdfMakeWrapper.setFonts(pdfFonts);
type TableRow = [];

@Component({
  selector: 'app-report-sail',
  templateUrl: './report-sail.component.html',
  styleUrls: ['./report-sail.component.css']
})
export class ReportSailComponent implements OnInit {

  fechaInicio : any;
  fechaFin : any;
  loading : boolean = false;
  sails : Sail[] = [];

  sailAux : any = [];
  user : User = {}; 

  products : any = [];
  subtotal : number = 0;
  iva : any = 0;
  total : any = 0;
  dataAux : any = [];

  constructor(
    private _rest : RestService,
    private _token : TokenService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getSails();
    this.getDataProfile();
  }

  getSails(){
    this.loading = true;
    this._rest.getSails().subscribe((response : Sail[])=>{
      this.sails = Object.values(response);
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

    this.sails = Object.values(data);

    console.log(this.sails);
    this.loading = false;
  }


  getDataProfile(){
    const data = this._token.getTokenDataUser() as string;
    this.user = JSON.parse(data);
    this.getRoleUser(this.user.id_role!);
  }

  getRoleUser(id_role : number){
    const roles : any= {
      1 : 'Gerente',
      2 : 'Administrador',
      3 : 'Contable',
      4 : 'Vendedor'
    }
  }

  async openModal(pedido : any){
    await this.extractDataSail(pedido);
    await this.getDetailsSailTotal();
    await this.getPDF();
  }

  async extractDataSail(sail : any){
    this.products = [];
    this.sailAux = sail.orders.map((item : any)=>{
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
              new Txt(`${this.sailAux[0].voucher}`).absolutePosition(330,90).fontSize(8).end,
            ]).end,
            new Columns([
              new Txt('FECHA DE AUTORIZACIÓN:').bold().absolutePosition(310,110).fontSize(8).end,
              new Txt(`${this.sailAux[0].create_date}`).absolutePosition(410,110).fontSize(8).end,
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
          new Txt(`${this.sailAux[0].name_user} ${this.sailAux[0].lastName_user}`).absolutePosition(210,190).fontSize(8).end,
        ]).end,
        new Columns([
          new Txt('DIRECCIÓN:').absolutePosition(50,200).fontSize(8).bold().end,
          new Txt(`${this.sailAux[0].address}`).absolutePosition(100,200).fontSize(8).end,
        ]).end,
        new Columns([
          new Txt('TELÉFONO:').absolutePosition(310,200).fontSize(8).bold().end,
          new Txt(`${this.sailAux[0].phone}`).absolutePosition(360,200).fontSize(8).end,
        ]).end,
        new Columns([
          new Txt('FECHA DE EMISIÓN:').absolutePosition(50,210).fontSize(8).bold().end,
          new Txt(`${this.sailAux[0].create_date}`).absolutePosition(130,210).fontSize(8).end,
        ]).end,
        new Txt('IDENTIFICACIÓN:').absolutePosition(310,210).fontSize(8).bold().end,
        new Txt(`${this.sailAux[0].document}`).absolutePosition(380,210).fontSize(8).end,
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
                  new Txt(`${this.sailAux[0].email}`).width('*').end,
                ]).end,
              ]).margin([0,10,0,24]).end,
            ]
          ]).widths([240]).fontSize(8).end,

          new Table([
            [ 
              new Txt('SUBTOTAL').fontSize(8).alignment('left').bold().end,
              new Txt(`$ ${(this.subtotal).toFixed(2)}`).fontSize(8).alignment('right').end,
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

  async exportPDF(){
    this.sailAux = [];

    this.sailAux = this.sails.filter((i)=> new Date(i.create_date).setHours(0,0,0,0).valueOf() >= (this.fechaInicio).valueOf() && new Date(i.create_date).setHours(0,0,0,0).valueOf() <= (this.fechaFin).valueOf() );
    
    if(this.sailAux.length == 0){
      this.messageService.add({severity:'success', summary: 'Completado', detail: 'No se encontraron registros en el rango de fechas elegidas', life : 4000});
      return ;
    }

    const fecha = new Date();
    const pdf = new PdfMakeWrapper();
    pdf.info({
        title: 'Reporte de Egresos',
        author: '@Yebba',
        subject: 'Mostrar los Egresos',
    });
    pdf.pageSize('A4');
    pdf.pageOrientation('portrait'); // 'portrait'
    pdf.add(
      new Stack([
        new Columns([
          await new Img('assets/img/log_app_pdf.svg').width(100).build(),
          new Columns([
            new Stack([
              new Columns([ 
                new Txt('Reporte de Ventas').fontSize(14).bold().end,
              ]).color('#3f3f3f').end,
              new Columns([ 
                new Txt('Módulo de Ventas  \n\n').fontSize(11).end,
              ]).color('#3f3f3f').end,
              new Columns([ 
                new Txt('').alignment('right').width('*').bold().end,
                new Txt('Usuario: ').alignment('right').width('*').bold().end,
                new Txt(`${this.user.user_name} ${this.user.user_lastName}`).width(60).alignment('right').end,
                new Txt('Fecha: ').alignment('right').width(40).bold().end,
                new Txt(`${fecha.getFullYear()}/${(fecha.getMonth()+1) < 10 ? '0'+(fecha.getMonth()+1) : (fecha.getMonth()+1)}/${fecha.getDate() < 10 ? '0'+fecha.getDate() : fecha.getDate()} `).width(55).alignment('right').end,
                new Txt('Hora:').alignment('right').width(30).bold().end,
                new Txt(`${fecha.getHours() < 10 ? '0'+fecha.getHours() : fecha.getHours()}:${fecha.getMinutes() < 10 ? '0'+fecha.getMinutes() : fecha.getMinutes()} \n\n`).width(30).alignment('right').end,
              ]).end,
            ]).width('*').color('#3f3f3f').alignment('right').fontSize(10).end
          ]).end
        ]).end
      ]).end
    );
    pdf.add(
      '\n'
    )
    pdf.add(
      new Columns([
        new Canvas([
            new Line([0,0], [515,0]).lineColor('#ccc').end
        ]).end,
      ]).width('*').end
    );
    pdf.add(
      '\n\n'
    )
    pdf.add(
      this.createDetailsPDF()
    );
    pdf.add(
      new Txt(`\n ${this.sailAux.length} ${this.sails.length < 2 ? 'Egreso' : 'Egresos'}`).alignment('right').bold().fontSize(10).margin(10).end
    );  
    pdf.add(this.createTable(this.sailAux));
    pdf.footer((currentPage : any, pageCount : any)=>{
      return new Txt(`Pág. ${currentPage}/${pageCount}`).color('#3f3f3f').margin([20,5,40,20]).alignment('right').fontSize(10).end;
    });
    pdf.create().open();
  }

  createTable(data : any): ITable{
    return new Table([
      [ 'Fecha de Creación','N° Orden','Cliente','Descripción', 'Número De Comprobante','Total'],
      ...this.extractData(data),
    ]).widths([ 100,45,100,100,'*',70]).color('#3f3f3f').layout('lightHorizontalLines').fontSize(10).end;
  }

  createDetailsPDF(){
    return new Stack([
      new Columns([ 
        new Txt('').bold().width('*').alignment('center').end,
        new Txt('Inicio: ').bold().width(30).alignment('center').end,
        new Txt(`${this.fechaInicio.getFullYear()}/${(this.fechaInicio.getMonth()+1) < 10 ? '0'+(this.fechaInicio.getMonth()+1) : (this.fechaInicio.getMonth()+1)}/${this.fechaInicio.getDate() < 10 ? '0'+this.fechaInicio.getDate() : this.fechaInicio.getDate()} `).width(65).alignment('center').end,
        new Txt('Fin: ').bold().width(20).alignment('center').end,
        new Txt(`${this.fechaFin.getFullYear()}/${(this.fechaFin.getMonth()+1) < 10 ? '0'+(this.fechaFin.getMonth()+1) : (this.fechaFin.getMonth()+1)}/${this.fechaFin.getDate() < 10 ? '0'+this.fechaFin.getDate() : this.fechaFin.getDate()} `).width(65).alignment('center').end,
        new Txt('Movimiento: ').width(55).bold().alignment('center').end,
        new Txt('Egresos').width(55).alignment('center').end,
        new Txt('').bold().width('*').alignment('center').end,
      ]).alignment('center').end,
    ]).color('#3f3f3f').alignment('center').fontSize(10).end
  }

  extractData(data : any) : TableRow{
    return data.map((row : any) => [
      row.create_date, row.id_order, row.order.user.user_name+" "+row.order.user.user_lastName, row.inventory_description , row.order.voucher_number, row.order.order_price_total,
    ])
  }
}
