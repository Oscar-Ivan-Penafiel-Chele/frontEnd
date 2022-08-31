import { Injectable } from '@angular/core';
import { Product, User } from '@models/interfaces';
import { Canvas, Cell, Columns, Img, ITable, Line, PdfMakeWrapper, Stack, Table, Txt  } from 'pdfmake-wrapper';

type TableRow = [];

@Injectable({
  providedIn: 'root'
})
export class GeneratePdfProductService {

  constructor() { }

  async generatePDF(user: User, products: Product[]){
    const fecha = new Date();
    let dataNow = (fecha.getFullYear() < 10 ? '0'+fecha.getFullYear() : fecha.getFullYear())+"-"+((fecha.getMonth()+1) < 10 ? '0'+(fecha.getMonth()+1) : (fecha.getMonth()+1))+"-"+ (fecha.getDate() < 10 ? '0'+fecha.getDate() : fecha.getDate())+" "+(fecha.getHours() < 10 ? '0'+fecha.getHours() : fecha.getHours())+":"+(fecha.getMinutes() < 10 ? '0'+fecha.getMinutes() : fecha.getMinutes())+":"+(fecha.getSeconds() < 10 ? '0'+fecha.getSeconds() : fecha.getSeconds());
    const pdf = new PdfMakeWrapper();
    pdf.info({
        title: 'PDF Productos',
        author: '@Yebba',
        subject: 'Mostrar los productos de la ferretería',
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
                  new Txt('Reporte de Productos').fontSize(14).bold().end,
                ]).color('#3f3f3f').end,
                new Columns([ 
                  new Txt('Módulo de Productos  \n\n').fontSize(11).end,
                ]).color('#3f3f3f').end,
                new Columns([ 
                  new Txt('').alignment('right').width('*').bold().end,
                  new Txt(`Usuario: ${user.user_name} ${user.user_lastName}`).alignment('right').width('*').bold().end,
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
        '\n'
      )
    pdf.add(
        new Txt('Reporte de Productos').alignment('center').bold().fontSize(11).margin(10).end
    );   

    pdf.add(this.createTable(products));

    pdf.footer((currentPage : any, pageCount : any)=>{
        return new Txt(`Pág. ${currentPage}/${pageCount}`).color('#3f3f3f').margin([20,5,40,20]).alignment('right').fontSize(7).end;
      });
    pdf.create().download(`${dataNow} Productos`)  
  }

  createTable(data : any): ITable{
    return new Table([
      [ 
        new Txt('Código').bold().end,
        new Txt('Nombre').bold().end,
        new Txt('Proveedor').bold().end,
        new Txt('Marca').bold().end,
        new Txt('Categoría').bold().end,
        new Txt('Medida').bold().end,
        new Txt('Stock').bold().end,
        new Txt('Estado').bold().end,
      ],
      ...this.extractData(data),
    ]).keepWithHeaderRows(1).headerRows(1).color('#3f3f3f').widths([50,200,120,70,70,70,50,50 ]).fontSize(9).end;
  }

  extractData(data : any) : TableRow{
    return data.map((row : any) => [row.product_code, row.product_name, row.provider.provider_name, row.brand.brand_name , row.category.category_name, row.product_unit.name_product_unit, row.product_stock, `${row.product_status == 1 ? 'Activo' : 'Inactivo'}`])
  }
}
