import { Injectable } from '@angular/core';
import { Sail, User } from '@models/interfaces';
import { Canvas, Columns, Img, Line, PdfMakeWrapper, Stack, Table, Txt  } from 'pdfmake-wrapper';

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

  constructor(
  ) { }

  async generateReport(sails : Sail[], fechaInicio : any , fechaFin : any, user : User){
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
    this.user = user;

    this.sailAux = [];

    this.sailAux = sails.filter((i : any)=> new Date(i.orders[0].i.create_date).setHours(0,0,0,0).valueOf() >= (this.fechaInicio).valueOf() && new Date(i.orders[0].i.create_date).setHours(0,0,0,0).valueOf() <= (this.fechaFin).valueOf() );

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
      '\n\n'
    )
    pdf.add(
      this.createDetailsPDF()
    );
    pdf.add(
      new Txt(`\n ${this.sailAux.length} ${sails.length < 2 ? 'Egreso' : 'Egresos'}`).alignment('right').bold().fontSize(10).margin(10).end
    );  

    pdf.add(
      new Table([
        [
            new Txt('Fecha de Creación').alignment('center').bold().end,
            new Txt('N° Orden').alignment('center').bold().end,
            new Txt('Cliente').alignment('center').bold().end,
            new Txt('Descripción').alignment('center').bold().end,
            new Txt('Número De Comprobante').alignment('center').bold().end,
            new Txt('Total').alignment('center').bold().end,
        ],
    ]).widths([90,40,100,80,100,50]).bold().fontSize(8).end
    );

    this.sailAux.forEach((row : any)=>{
        pdf.add(
            new Table([
                [
                  new Txt(`${row.orders[0].i.create_date}`).alignment('center').end,
                  new Txt(`${(row.orders[0].i.id_order)}`).alignment('center').end,
                  new Txt(`${row.orders[0].i.order.user.user_name+" "+row.orders[0].i.order.user.user_lastName}`).alignment('center').end,
                  new Txt(`${row.orders[0].i.inventory_description}`).alignment('center').end,
                  new Txt(`${row.orders[0].i.order.voucher_number}`).alignment('center').end,
                  new Txt(`$ ${row.orders[0].i.order.order_price_total}`).alignment('center').end,
                ],
            ]).widths([90,40,100,80,100,50]).fontSize(8).end
        );
    });

    pdf.footer((currentPage : any, pageCount : any)=>{
      return new Txt(`Pág. ${currentPage}/${pageCount}`).color('#3f3f3f').margin([20,5,40,20]).alignment('right').fontSize(10).end;
    });
    pdf.create().open();
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
  
}
