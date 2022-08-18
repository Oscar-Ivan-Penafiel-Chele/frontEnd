import { Injectable } from '@angular/core';
import { Category, Product, User } from '@models/interfaces';
import { Canvas, Columns, Img, Line, PdfMakeWrapper, Rect, Stack, Table, Txt  } from 'pdfmake-wrapper';

@Injectable({
  providedIn: 'root'
})
export class GeneratePdfStatisticsSailService {
  fechaInicio: any;
  fechaFin: any;

  constructor() { }

  async generatePDFStatistic(sails: any, user: User, fechaIncio: any, fechaFin: any, selectedCategory: Category[], selectedProduct: Product){
    this.fechaInicio = fechaIncio;
    this.fechaFin = fechaFin;

    console.log("PDF ESTADISTICA DE VENTAS");

    console.log(sails)

    const fecha = new Date();
    const pdf = new PdfMakeWrapper();
    
    pdf.info({
        title: 'Reporte de Egresos',
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
                new Txt('Reporte de Ventas').fontSize(14).bold().end,
              ]).color('#3f3f3f').end,
              new Columns([ 
                new Txt('Módulo de Ventas  \n\n').fontSize(11).end,
              ]).color('#3f3f3f').end,
              new Columns([ 
                new Txt('').alignment('right').width('*').bold().end,
                new Txt(`Usuario: ${user.user_name} ${user.user_lastName}`).alignment('right').width('*').bold().end,
                // new Txt(``).width(60).alignment('right').end,
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
            new Line([0,0], [755,0]).lineColor('#ccc').end
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
      new Txt(`${sails.length} ${sails.length < 2 ? 'Venta' : 'Ventas'}`).alignment('right').bold().fontSize(10).margin(10).end
    ); 

    pdf.add(
      new Table([
        [
            new Txt('Fecha').alignment('center').bold().end,
            new Txt('Factura').alignment('center').bold().end,
            new Txt('Identificación').alignment('center').bold().end,
            new Txt('Cliente').alignment('center').bold().end,
            new Txt('Categoría').alignment('center').bold().end,
            new Txt('Producto').alignment('center').bold().end,
            new Txt('Total').alignment('center').bold().end,
            new Txt('Forma de Pago').alignment('center').bold().end,
        ],
      ]).widths([90,90,80,120,80,110, 50, 60]).bold().fontSize(8).end
    );

    sails.forEach((row : any)=>{
      pdf.add(
          new Table([
              [
                new Txt(`${row.create_date}`).alignment('center').end,
                new Txt(`${(row.voucher)}`).alignment('center').end,
                new Txt(`${row.identification}`).alignment('center').end,
                new Txt(`${row.name}`).alignment('center').end,
                new Txt(`${row.category}`).alignment('center').end,
                new Txt(`$ ${row.product}`).alignment('center').end,
                new Txt(`${row}`).alignment('center').end,
                new Txt(`$ ${row}`).alignment('center').end,
              ],
          ]).widths([90,90,80,120,80,110, 50, 60]).fontSize(8).end
      );
  });

    pdf.footer((currentPage : any, pageCount : any)=>{
      return new Txt(`Pág. ${currentPage}/${pageCount}`).color('#3f3f3f').margin([20,5,40,20]).alignment('right').fontSize(7).end;
    });
    pdf.create().open();
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
        new Txt('Egresos').width(45).alignment('center').end,
        new Txt('').bold().width('*').alignment('center').end,
      ]).alignment('center').end,
    ]).color('#3f3f3f').alignment('center').fontSize(10).end
  }
  
}
