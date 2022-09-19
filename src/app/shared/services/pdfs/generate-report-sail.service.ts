import { Injectable } from '@angular/core';
import { Sail, User } from '@models/interfaces';
import { Canvas, Cell, Columns, Img, ITable, Line, PdfMakeWrapper, Stack, Table, Txt  } from 'pdfmake-wrapper';

type TableRow = [];

@Injectable({
  providedIn: 'root'
})
export class GenerateReportSailService {

  fechaInicio : any;
  fechaFin : any;
  sailAux : any = [];
  user : User = {};
  arrayAux : any[] = [];
  total: number = 0;

  constructor(
  ) { }

  async generateReport(sails : Sail[], fechaInicio : any , fechaFin : any, user : User){
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
    this.user = user;

    this.sailAux = [];

    this.sailAux = sails.filter((i : any)=> new Date(i.orders[0].i.create_date).setHours(0,0,0,0).valueOf() >= (this.fechaInicio).valueOf() && new Date(i.orders[0].i.create_date).setHours(0,0,0,0).valueOf() <= (this.fechaFin).valueOf() );
    this.total = 0;
    this.getTotal(this.sailAux);

    const fecha = new Date();
    let dataNow = (fecha.getFullYear() < 10 ? '0'+fecha.getFullYear() : fecha.getFullYear())+"-"+((fecha.getMonth()+1) < 10 ? '0'+(fecha.getMonth()+1) : (fecha.getMonth()+1))+"-"+ (fecha.getDate() < 10 ? '0'+fecha.getDate() : fecha.getDate())+" "+(fecha.getHours() < 10 ? '0'+fecha.getHours() : fecha.getHours())+":"+(fecha.getMinutes() < 10 ? '0'+fecha.getMinutes() : fecha.getMinutes())+":"+(fecha.getSeconds() < 10 ? '0'+fecha.getSeconds() : fecha.getSeconds());

    const pdf = new PdfMakeWrapper();

    pdf.info({
        title: 'Reporte de Ventas',
        author: '@Yebba',
        subject: 'Mostrar las Ventas',
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
                new Txt(`${fecha.getHours() < 10 ? '0'+fecha.getHours() : fecha.getHours()}:${fecha.getMinutes() < 10 ? '0'+fecha.getMinutes() : fecha.getMinutes()} \n\n`).width(23).alignment('right').end,
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
      '\n'
    )
    pdf.add(
      this.createDetailsPDF()
    );

    pdf.add(
      new Txt(`${this.sailAux.length} ${this.sailAux.length < 2 ? 'Egreso' : 'Egresos'}`).alignment('right').bold().fontSize(10).margin(10).end
    );

    pdf.add(this.createTable(this.sailAux));

    pdf.footer((currentPage : any, pageCount : any)=>{
      return new Txt(`Pág. ${currentPage}/${pageCount}`).color('#3f3f3f').margin([20,5,40,20]).alignment('right').fontSize(10).end;
    });
    pdf.create().download(`${dataNow} Reporte-de-Ventas`)
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

  createTable(data : any): ITable{
    return new Table([
      [
        new Txt('Fecha de Creación').bold().end,
        new Txt('N° Orden').bold().end,
        new Txt('Cliente').bold().end,
        new Txt('Descripción').bold().end,
        new Txt('Factura').bold().end,
        new Txt('Total').bold().end,
      ],
      ...this.extractData(data),
      [new Cell(new Txt('').end).colSpan(4).end,
        null, null, null,
        new Txt('TOTAL DE VENTAS').bold().end,
        new Txt(`$ ${this.total.toFixed(2)}`).end,
      ]
    ]).keepWithHeaderRows(1).headerRows(1).color('#3f3f3f').widths([90,40,100,80,100,50]).fontSize(9).end;
  }

  extractData(data : any) : TableRow{
    return data.map((row : any) => [
      row.orders[0].i.create_date, row.orders[0].i.id_order, `${row.orders[0].i.order.user.user_name+" "+row.orders[0].i.order.user.user_lastName}` ,row.orders[0].i.inventory_description , row.orders[0].i.order.voucher_number, `$ ${row.orders[0].i.order.order_price_total}`
    ])
  }

  getTotal(sails: any){
    sails.forEach((item: any) => {
      this.total += parseFloat(item.orders[0].i.order.order_price_total);
    });
  }
}
