import { Injectable } from '@angular/core';
import { IPurchaseOrder } from '@models/interfaces';
import { Canvas, Columns, Img, PdfMakeWrapper, Rect, Stack, Table, Txt  } from 'pdfmake-wrapper';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderPdfService {

  constructor() { }

  async generatePDF(purchase_order: IPurchaseOrder){
    const pdf = new PdfMakeWrapper();

    pdf.info({
      title: 'Orden de Compra',
      author: '@Yebba',
      subject: 'Orden de Compra',
    });
    pdf.pageSize('A4');
    pdf.pageOrientation('portrait'); // 'portrait'


    pdf.footer((currentPage : any, pageCount : any)=>{
      return new Txt(`Pág. ${currentPage}/${pageCount}`).color('#3f3f3f').margin([20,5,40,20]).alignment('right').fontSize(7).end;
    });
    pdf.create().open();  
  }
}
