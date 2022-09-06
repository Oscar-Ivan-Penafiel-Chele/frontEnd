import { Injectable } from '@angular/core';
import { IPurchaseOrder } from '@models/interfaces';
import { Canvas, Cell, Columns, Img, ITable, Line, PdfMakeWrapper, Rect, Stack, Table, Txt  } from 'pdfmake-wrapper';

type TableRow = [];

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderPdfService {

  constructor() { }

  async generatePDF(purchase_order: any){
    const pdf = new PdfMakeWrapper();
    const fecha = new Date();
    let dataNow = (fecha.getFullYear() < 10 ? '0'+fecha.getFullYear() : fecha.getFullYear())+"-"+((fecha.getMonth()+1) < 10 ? '0'+(fecha.getMonth()+1) : (fecha.getMonth()+1))+"-"+ (fecha.getDate() < 10 ? '0'+fecha.getDate() : fecha.getDate())+" "+(fecha.getHours() < 10 ? '0'+fecha.getHours() : fecha.getHours())+":"+(fecha.getMinutes() < 10 ? '0'+fecha.getMinutes() : fecha.getMinutes())+":"+(fecha.getSeconds() < 10 ? '0'+fecha.getSeconds() : fecha.getSeconds());

    pdf.info({
      title: 'Orden de Compra',
      author: '@Yebba',
      subject: 'Orden de Compra',
    });
    pdf.pageSize('A4');
    pdf.pageOrientation('portrait'); // 'portrait'

    pdf.add(
      new Stack([
        new Columns([

          new Stack([
            new Columns([
              await new Img('assets/img/log_app_pdf.svg').margin([0,0,0,0]).width(130).build(),
            ]).end,
            new Columns([
              new Stack([
                new Columns([
                  new Txt('Razón Social: Ferretería "El Descanso"').absolutePosition(40,135).fontSize(9).end,
                  new Txt('Dirección: Primavera 2').absolutePosition(40,150).fontSize(9).end,
                  new Txt('Teléfono: +59342805414').absolutePosition(40,165).fontSize(9).end,
                  new Txt('Sitio Web: https://ferreteriaeldescanso.jomatelapps.com/').absolutePosition(40,180).fontSize(9).end,
                ]).end,
              ]).end
            ]).margin([0,10,0,0]).end,
          ]).end,

          new Stack([
            new Columns([
              new Txt('ORDEN DE COMPRA').absolutePosition(300,50).bold().fontSize(20).end,
            ]).end,
            new Columns([
              new Txt('Fecha:').absolutePosition(310,135).bold().fontSize(9).end,
              new Txt(`${purchase_order.create_date}`).absolutePosition(340,135).fontSize(9).end,
            ]).end,
            new Columns([
              new Txt('OC #:').bold().absolutePosition(310,150).bold().fontSize(9).end,
              new Txt(`${purchase_order.id_purchase_order}`).absolutePosition(340,150).fontSize(9).end,
            ]).end,
          ]).end
        ]).end
      ]).end
    );

    pdf.add('\n');
    pdf.add('\n');
    pdf.add('\n');
    pdf.add('\n');
    pdf.add('\n');
    pdf.add('\n');
    pdf.add('\n');

    pdf.add(new Stack([
        new Canvas([
          new Rect([0, 0], [508, 20 ]).end,
        ]).end,
        new Columns([
          new Txt('ENVIE A').absolutePosition(50,225).fontSize(9).bold().end,
        ]).end,
        new Columns([
          new Txt('Razón Social:').absolutePosition(40,250).bold().fontSize(9).end,
          new Txt(`${purchase_order.provider.provider_name}`).absolutePosition(125,250).fontSize(9).end,
        ]).end,
        new Columns([
          new Txt('Dírección:').absolutePosition(40,265).bold().fontSize(9).end,
          new Txt(`${purchase_order.provider.provider_address}`).absolutePosition(125,265).fontSize(9).end,
        ]).end,
        new Columns([
          new Txt('Teléfono:').absolutePosition(40,280).bold().fontSize(9).end,
          new Txt(`${purchase_order.provider.provider_landline}`).absolutePosition(125,280).fontSize(9).end,
        ]).end,
        new Columns([
          new Txt('Celular:').absolutePosition(40,295).bold().fontSize(9).end,
          new Txt(`${purchase_order.provider.provider_phone}`).absolutePosition(125,295).fontSize(9).end,
        ]).end,
        new Columns([
          new Txt('Correo electrónico:').absolutePosition(40,310).bold().fontSize(9).end,
          new Txt(`${purchase_order.provider.provider_email}`).absolutePosition(125,310).fontSize(9).end,
        ]).end,
      ]).end  
    );

    pdf.add('\n');
    pdf.add('\n');
    pdf.add('\n');
    pdf.add('\n');
    pdf.add('\n');
    pdf.add('\n');
    pdf.add('\n');

    pdf.add(this.createTable(purchase_order));

    pdf.footer((currentPage : any, pageCount : any)=>{
      return new Txt(`Pág. ${currentPage}/${pageCount}`).color('#3f3f3f').margin([20,5,40,20]).alignment('right').fontSize(7).end;
    });
    pdf.create().download(`${dataNow} Reporte-de-Ventas`) 
  }

  createTable(data : any): ITable{
    return new Table([
      [ 
        new Txt('Código').alignment('center').bold().end,
        new Txt('Nombre del Producto').alignment('center').bold().end,
        new Txt('Cantidad').alignment('center').bold().end,
      ],
      ...this.extractData(data),
    ]).keepWithHeaderRows(1).headerRows(1).color('#3f3f3f').alignment('center').widths([50,'*',60]).fontSize(9).end;
  }

  extractData(data : any) : TableRow{
    return data.purchase_order_productos.map((row : any) => [
      row.id_product, row.producto.product_name, row.purchase_order_products_amount.toString().split('.')[0]
    ]);
  }

  
}
