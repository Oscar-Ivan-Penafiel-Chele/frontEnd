import { Injectable } from '@angular/core';
import { IPurchaseOrder, User } from '@models/interfaces';
import { Canvas, Cell, Columns, Img, ITable, Line, PdfMakeWrapper, Stack, Table, Txt  } from 'pdfmake-wrapper';

type TableRow = [];

@Injectable({
  providedIn: 'root'
})
export class GeneratePdfStatisticsPurchaseOrderService {
  fechaInicio: any;
  fechaFin: any;
  total: number = 0.00;

  constructor() { }

  async generatePDF(purchase_order: IPurchaseOrder[], user: User, fechaIncio: any, fechaFin: any){
    this.getTotal(purchase_order);
    this.fechaInicio = fechaIncio;
    this.fechaFin = fechaFin;

    const fecha = new Date();
    let dataNow = (fecha.getFullYear() < 10 ? '0'+fecha.getFullYear() : fecha.getFullYear())+"-"+((fecha.getMonth()+1) < 10 ? '0'+(fecha.getMonth()+1) : (fecha.getMonth()+1))+"-"+ (fecha.getDate() < 10 ? '0'+fecha.getDate() : fecha.getDate())+" "+(fecha.getHours() < 10 ? '0'+fecha.getHours() : fecha.getHours())+":"+(fecha.getMinutes() < 10 ? '0'+fecha.getMinutes() : fecha.getMinutes())+":"+(fecha.getSeconds() < 10 ? '0'+fecha.getSeconds() : fecha.getSeconds());

    const pdf = new PdfMakeWrapper();
    
    pdf.info({
        title: 'Estadística de Compras',
        author: '@Yebba',
        subject: 'Mostrar las Ordenes de Compra',
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
                new Txt('Estadística de Compras').fontSize(14).bold().end,
              ]).color('#3f3f3f').end,
              new Columns([ 
                new Txt('Módulo de Órdenes de Compras  \n\n').fontSize(11).end,
              ]).color('#3f3f3f').end,
              new Columns([ 
                new Txt('').alignment('right').width('*').bold().end,
                new Txt('Usuario: ').alignment('right').width('*').bold().end,
                new Txt(`${user.user_name} ${user.user_lastName}`).width(60).alignment('right').end,
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
            new Line([0,0], [520,0]).lineColor('#ccc').end
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
      new Txt(`${purchase_order.length} ${purchase_order.length < 2 ? 'Orden de Compra' : 'Órdenes de Compras'}`).alignment('right').bold().fontSize(10).margin(10).end
    );  

    pdf.add(this.createTable(purchase_order));

    pdf.footer((currentPage : any, pageCount : any)=>{
      return new Txt(`Pág. ${currentPage}/${pageCount}`).color('#3f3f3f').margin([20,5,40,20]).alignment('right').fontSize(7).end;
    });
    pdf.create().download(`${dataNow} Estadistica-Compras`)  

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
        new Txt('Orden de Compra').width(90).alignment('center').end,
        new Txt('').bold().width('*').alignment('center').end,
      ]).alignment('center').end,
    ]).color('#3f3f3f').alignment('center').fontSize(10).end
  }

  createTable(data : any): ITable{
    return new Table([
      [ 
        new Txt('Fecha Creación').fontSize(10).bold().end,
        new Txt('Factura').fontSize(10).bold().end,
        new Txt('Proveedor').fontSize(10).bold().end,
        new Txt('Estado').fontSize(10).bold().end,
        new Txt('Forma de Pago').fontSize(10).bold().end,
        new Txt('Total').fontSize(10).bold().end,
      ],
      ...this.extractData(data),
      [new Cell(new Txt('').end).colSpan(4).end, 
        null, null, null, 
        new Txt('TOTAL').bold().end,
        new Txt(`$ ${this.total.toFixed(2)}`).end,
      ]
    ]).keepWithHeaderRows(1).headerRows(1).color('#3f3f3f').widths([90,90,90,60,70,60]).fontSize(9).end;
  }

  extractData(data : any) : TableRow{
    return data.map((row : any) => [
      row.create_date, row.facture, row.provider.provider_name , row.purchase_order_status == 1 ? 'Completado' : 'Pendiente' , row.tipe_of_pay, `$ ${row.purchase_order_total}`
    ])
  }
  
  getTotal(sails: any){
    sails.forEach((item: any) => {
      let totalByProduct = parseFloat(item.purchase_order_total)
      this.total! += totalByProduct;
    });
  }

}
