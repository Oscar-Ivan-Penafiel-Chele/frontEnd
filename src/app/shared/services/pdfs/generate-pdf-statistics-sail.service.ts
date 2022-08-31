import { Injectable } from '@angular/core';
import { Category, Product, User } from '@models/interfaces';
import { Canvas, Cell, Columns, Img, ITable, Line, PdfMakeWrapper, Stack, Table, Txt  } from 'pdfmake-wrapper';

type TableRow = [];

@Injectable({
  providedIn: 'root'
})

export class GeneratePdfStatisticsSailService {
  fechaInicio: any;
  fechaFin: any;
  total: number = 0;

  constructor() { }

  async generatePDFStatistic(sails: any, user: User, fechaIncio: any, fechaFin: any, selectedCategory: Category[], selectedProduct: Product){
    const pdf = new PdfMakeWrapper();
    
    this.getTotal(sails);
    const fecha = this.getDate();

    this.fechaInicio = fechaIncio;
    this.fechaFin = fechaFin;

    
    pdf.info({
        title: 'Estadística de Ventas',
        author: '@Yebba',
        subject: 'Mostrar los Egresos',
    });
    pdf.pageSize('A4');
    pdf.pageOrientation('landscape'); // 'portrait'
    
    pdf.add(
      new Stack([
        new Columns([
          await new Img('assets/img/log_app_pdf.svg').width(100).build(),
          new Columns([
            new Stack([
              new Columns([ 
                new Txt('Estadística de Ventas').fontSize(14).bold().end,
              ]).color('#3f3f3f').end,
              new Columns([ 
                new Txt('Módulo de Ventas  \n\n').fontSize(11).end,
              ]).color('#3f3f3f').end,
              new Columns([ 
                new Txt('').alignment('right').width('*').bold().end,
                new Txt('Usuario: ').alignment('right').width('*').bold().end,
                new Txt(`${user.user_name} ${user.user_lastName}`).width(60).alignment('right').end,
                new Txt('Fecha: ').alignment('right').width(40).bold().end,
                new Txt(`${fecha.year}/${fecha.month}/${fecha.day}`).width(55).alignment('right').end,
                new Txt('Hora:').alignment('right').width(30).bold().end,
                new Txt(`${fecha.hour}:${fecha.minutes} \n\n`).width(23).alignment('right').end,
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
            new Line([0,0], [770,0]).lineColor('#ccc').end
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
      new Txt(`${sails.length} ${sails.length < 2 ? 'Venta' : 'Ventas'}`).alignment('right').bold().fontSize(10).margin(10).end
    );  

    pdf.add(this.createTable(sails));

    pdf.footer((currentPage : any, pageCount : any)=>{
      return new Txt(`Pág. ${currentPage}/${pageCount}`).color('#3f3f3f').margin([20,5,40,20]).alignment('right').fontSize(7).end;
    });
    pdf.create().download(`${fecha.year}-${fecha.month}-${fecha.day} ${fecha.hour}-${fecha.minutes} Estadística-de-Ventas.pdf`);
  }


  createDetailsPDF(){
    return new Stack([
      new Columns([ 
        new Txt('').bold().width('*').alignment('center').end,
        new Txt('Inicio: ').bold().width(26).alignment('center').end,
        new Txt(`${this.fechaInicio.getFullYear()}/${(this.fechaInicio.getMonth()+1) < 10 ? '0'+(this.fechaInicio.getMonth()+1) : (this.fechaInicio.getMonth()+1)}/${this.fechaInicio.getDate() < 10 ? '0'+this.fechaInicio.getDate() : this.fechaInicio.getDate()} `).width(65).alignment('center').end,
        new Txt('Fin: ').bold().width(23).alignment('center').end,
        new Txt(`${this.fechaFin.getFullYear()}/${(this.fechaFin.getMonth()+1) < 10 ? '0'+(this.fechaFin.getMonth()+1) : (this.fechaFin.getMonth()+1)}/${this.fechaFin.getDate() < 10 ? '0'+this.fechaFin.getDate() : this.fechaFin.getDate()} `).width(65).alignment('center').end,
        new Txt('Movimiento: ').width(55).bold().alignment('center').end,
        new Txt('Ventas').width(45).alignment('center').end,
        new Txt('').bold().width('*').alignment('center').end,
      ]).alignment('center').end,
    ]).color('#3f3f3f').alignment('center').fontSize(10).end
  }

  createTable(data : any): ITable{
    return new Table([
      [ 
        new Txt('Fecha').fontSize(10).bold().end,
        new Txt('Factura').fontSize(10).bold().end,
        new Txt('Identificación').fontSize(10).bold().end,
        new Txt('Cliente').fontSize(10).bold().end,
        new Txt('Categoría').fontSize(10).bold().end,
        new Txt('Producto').fontSize(10).bold().end,
        new Txt('Forma de Pago').fontSize(10).bold().end,
        new Txt('Total').fontSize(10).bold().end,
      ],
      ...this.extractData(data),
      [new Cell(new Txt('').end).colSpan(6).end, 
        null, null, null, null, null, 
        new Txt('TOTAL DE VENTAS').bold().end,
        new Txt(`$ ${this.total}`).end,
      ]
    ]).keepWithHeaderRows(1).headerRows(1).color('#3f3f3f').widths([90,90,70,100,60,140, 80, 60]).fontSize(9).end;
  }

  extractData(data : any) : TableRow{
    return data.map((row : any) => [
      row.create_date, row.voucher, row.identification ,row.name , row.category, row.product, row.type_pay, `$ ${row.total}`
    ])
  }
  
  getTotal(sails: any){
    sails.forEach((item: any) => {
      this.total += parseFloat(item.total);
    });
  }

  getDate(){
    const fecha = new Date();

    return {
      year: fecha.getFullYear(), 
      month: (fecha.getMonth()+1) < 10 ? '0'+(fecha.getMonth()+1) : (fecha.getMonth()+1) , 
      day: fecha.getDate() < 10 ? '0'+fecha.getDate() : fecha.getDate(),
      hour: fecha.getHours() < 10 ? '0'+fecha.getHours() : fecha.getHours(),
      minutes: fecha.getMinutes() < 10 ? '0'+fecha.getMinutes() : fecha.getMinutes()
    }
  }
}
