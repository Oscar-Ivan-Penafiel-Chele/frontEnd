import { Injectable } from '@angular/core';
import { Auditory, User } from '@models/interfaces';
import { Canvas, Cell, Columns, Img, ITable, Line, PdfMakeWrapper, Stack, Table, Txt  } from 'pdfmake-wrapper';

type TableRow = [];

@Injectable({
  providedIn: 'root'
})
export class GeneratePdfAuditoryService {

  constructor() { }

  async generatePDF(auditories: Auditory[], user: User){
    const pdf = new PdfMakeWrapper();
    const fecha = new Date();
    let dataNow = (fecha.getFullYear() < 10 ? '0'+fecha.getFullYear() : fecha.getFullYear())+"-"+((fecha.getMonth()+1) < 10 ? '0'+(fecha.getMonth()+1) : (fecha.getMonth()+1))+"-"+ (fecha.getDate() < 10 ? '0'+fecha.getDate() : fecha.getDate())+" "+(fecha.getHours() < 10 ? '0'+fecha.getHours() : fecha.getHours())+":"+(fecha.getMinutes() < 10 ? '0'+fecha.getMinutes() : fecha.getMinutes())+":"+(fecha.getSeconds() < 10 ? '0'+fecha.getSeconds() : fecha.getSeconds());
    pdf.info({
        title: 'PDF Auditoría',
        author: '@Yebba',
        subject: 'Auditoría',
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
                new Txt('Registros de Auditoría').fontSize(14).bold().end,
              ]).color('#3f3f3f').end,
              new Columns([ 
                new Txt('Módulo de Auditoría  \n\n').fontSize(11).end,
              ]).color('#3f3f3f').end,
              new Columns([ 
                new Txt(`Usuario: ${user.user_name} ${user.user_lastName}`).alignment('right').bold().end,
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
      new Txt(`${auditories.length} ${auditories.length < 2 ? 'Registro' : 'Registros'}`).alignment('right').bold().fontSize(10).margin(10).end
    ); 

    pdf.add(
        new Txt('Auditoría de la Aplciación Web E-commerce B2C de la ferretería "El Descanso"').alignment('center').bold().fontSize(11).margin(10).end
    );   

    pdf.add(this.createTable(auditories));

    pdf.footer((currentPage : any, pageCount : any)=>{
      return new Txt(`Pág. ${currentPage}/${pageCount}`).color('#3f3f3f').margin([20,5,40,20]).alignment('right').fontSize(7).end;
    });
    pdf.create().download(`${dataNow} Auditoría`) 
  }

  createTable(data : any): ITable{
    return new Table([
      [ 
        new Txt('Fecha de creación').bold().end,
        new Txt('Usuario').bold().end,
        new Txt('Acción').bold().end,
        new Txt('Módulo').bold().end,
        new Txt('Descripción').bold().end,
        new Txt('Query').bold().end,
      ],
      ...this.extractData(data),
    ]).keepWithHeaderRows(1).headerRows(1).color('#3f3f3f').widths([90,90,75,75,100,270]).fontSize(9).end;
  }

  extractData(data : any) : TableRow{
    return data.map((row : any) => [
      row.create_date, `${row.user.user_name} ${row.user.user_lastName}`, row.audit_action, row.audit_module, row.audit_description , row.audit_query
    ])
  }

}
