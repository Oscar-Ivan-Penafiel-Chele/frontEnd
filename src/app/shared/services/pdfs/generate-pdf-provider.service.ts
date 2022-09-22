import { Injectable } from '@angular/core';
import { IProvider, User } from '@models/interfaces';
import { Canvas, Cell, Columns, Img, ITable, Line, PdfMakeWrapper, Stack, Table, Txt  } from 'pdfmake-wrapper';

type TableRow = [];

@Injectable({
  providedIn: 'root'
})
export class GeneratePdfProviderService {

  constructor() { }

  async generatePDF(provider: IProvider[], user: User){
    provider.sort(this.sortProvider)

    const fecha = new Date();
    let dataNow = (fecha.getFullYear() < 10 ? '0'+fecha.getFullYear() : fecha.getFullYear())+"-"+((fecha.getMonth()+1) < 10 ? '0'+(fecha.getMonth()+1) : (fecha.getMonth()+1))+"-"+ (fecha.getDate() < 10 ? '0'+fecha.getDate() : fecha.getDate())+" "+(fecha.getHours() < 10 ? '0'+fecha.getHours() : fecha.getHours())+":"+(fecha.getMinutes() < 10 ? '0'+fecha.getMinutes() : fecha.getMinutes())+":"+(fecha.getSeconds() < 10 ? '0'+fecha.getSeconds() : fecha.getSeconds());

    const pdf = new PdfMakeWrapper();
    pdf.info({
        title: 'PDF Proveedores',
        author: '@Yebba',
        subject: 'Mostrar los proveedores de la ferretería',
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
                new Txt('Nómina de Proveedores').fontSize(14).bold().end,
              ]).color('#3f3f3f').end,
              new Columns([
                new Txt('Módulo de Proveedores  \n\n').fontSize(11).end,
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
      '\n\n'
    )
    pdf.add(
      new Txt(`${provider.length} ${provider.length < 2 ? 'Proveedor' : 'Proveedores'}`).alignment('right').bold().fontSize(10).margin(10).end
  );
    pdf.add(
        new Txt('Nómina de Proveedores').alignment('center').bold().fontSize(11).margin(10).end
    );

    pdf.add(this.createTable(provider));

    pdf.footer((currentPage : any, pageCount : any)=>{
      return new Txt(`Pág. ${currentPage}/${pageCount}`).color('#3f3f3f').margin([20,5,40,20]).alignment('right').fontSize(7).end;
    });
    pdf.create().download(`${dataNow} Proveedores`)
  }

  sortProvider(x:any , y:any){
    if(x.provider_name < y.provider_name) return -1;
    if(x.provider_name > y.provider_name) return 1;
    return 0;
  }

  createTable(data : any): ITable{
    return new Table([
      [
        new Txt('Código').bold().end,
        new Txt('Nombre').bold().end,
        new Txt('Correo Electrónico').bold().end,
        new Txt('Dirección').bold().end,
        new Txt('Teléfono').bold().end,
        new Txt('Celular').bold().end,
        new Txt('Tiempo de Respuesta').bold().end,
        new Txt('Estado').bold().end,
      ],
      ...this.extractData(data),
    ]).keepWithHeaderRows(1).headerRows(1).color('#3f3f3f').widths([40,120,120,130,60,80,100,40]).fontSize(9).end;
  }

  extractData(data : any) : TableRow{
    return data.map((row : any) => [
      row.id_provider, row.provider_name, row.provider_email, row.provider_address , row.provider_landline, row.provider_phone, `${row.provider_response_time_day} Días ${row.provider_response_time_hour} Horas`, `${row.provider_status == 1 ? 'Activo' : 'Inactivo'}`
    ])
  }
}
