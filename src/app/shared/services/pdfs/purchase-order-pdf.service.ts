import { Injectable } from '@angular/core';
import { IPurchaseOrder } from '@models/interfaces';
import { Canvas, Columns, Img, PdfMakeWrapper, Rect, Stack, Table, Txt  } from 'pdfmake-wrapper';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderPdfService {

  constructor() { }

  async generatePDF(purchase_order: any){
    console.log(purchase_order)
    const pdf = new PdfMakeWrapper();

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
          new Txt('Razón Social:').absolutePosition(40,260).bold().fontSize(9).end,
          new Txt(`${purchase_order.provider.provider_name}`).absolutePosition(125,260).fontSize(9).end,
        ]).end,
        new Columns([
          new Txt('Dírección:').absolutePosition(40,275).bold().fontSize(9).end,
          new Txt(`${purchase_order.provider.provider_address}`).absolutePosition(125,275).fontSize(9).end,
        ]).end,
        new Columns([
          new Txt('Teléfono:').absolutePosition(40,290).bold().fontSize(9).end,
          new Txt(`${purchase_order.provider.provider_landline}`).absolutePosition(125,290).fontSize(9).end,
        ]).end,
        new Columns([
          new Txt('Celular:').absolutePosition(40,305).bold().fontSize(9).end,
          new Txt(`${purchase_order.provider.provider_phone}`).absolutePosition(125,305).fontSize(9).end,
        ]).end,
        new Columns([
          new Txt('Correo electrónico:').absolutePosition(40,320).bold().fontSize(9).end,
          new Txt(`${purchase_order.provider.provider_email}`).absolutePosition(125,320).fontSize(9).end,
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
    pdf.add('\n');
    pdf.add('\n');

    pdf.add(
      new Table([
        [
            new Txt('Cód. Principal').alignment('center').bold().end,
            new Txt('Descripción').alignment('center').bold().end,
            new Txt('Cantidad').alignment('center').bold().end,
        ],
      ]).widths([50,350,'*']).bold().fontSize(9).end
    );

    purchase_order.purchase_order_productos.forEach((item : any)=>{
      pdf.add(
          new Table([
              [
                new Txt(`${item.id_product}`).alignment('center').end,
                new Txt(`${(item.producto.product_name)}`).alignment('center').end,
                new Txt(`${item.purchase_order_products_amount.toString().split('.')[0]}`).alignment('center').end,
              ],
          ]).widths([50,350,'*']).fontSize(9).end
      );
   })

    pdf.footer((currentPage : any, pageCount : any)=>{
      return new Txt(`Pág. ${currentPage}/${pageCount}`).color('#3f3f3f').margin([20,5,40,20]).alignment('right').fontSize(7).end;
    });
    pdf.create().open();  
  }
}
