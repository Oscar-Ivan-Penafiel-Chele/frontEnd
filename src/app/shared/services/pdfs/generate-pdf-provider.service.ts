import { Injectable } from '@angular/core';
import { IProvider, User } from '@models/interfaces';
import { Canvas, Columns, Img, Line, PdfMakeWrapper, Stack, Table, Txt  } from 'pdfmake-wrapper';

@Injectable({
  providedIn: 'root'
})
export class GeneratePdfProviderService {

  constructor() { }

  async generatePDF(provider: IProvider[], user: User){
    const fecha = new Date();
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
                new Txt('Usuario: ').alignment('right').width('*').bold().end,
                new Txt(`${user.user_name} ${user.user_lastName}`).width(60).alignment('right').end,
                new Txt('Fecha: ').alignment('right').width(40).bold().end,
                new Txt(`${fecha.getFullYear()}/${(fecha.getMonth()+1) < 10 ? '0'+(fecha.getMonth()+1) : (fecha.getMonth()+1)}/${fecha.getDate() < 10 ? '0'+fecha.getDate() : fecha.getDate()} `).width(55).alignment('right').end,
                new Txt('Hora:').alignment('right').width(30).bold().end,
                new Txt(`${fecha.getHours() < 10 ? '0'+fecha.getHours() : fecha.getHours()}:${fecha.getMinutes() < 10 ? '0'+fecha.getMinutes() : fecha.getMinutes()} \n\n`).width(30).alignment('right').end,
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
      new Txt(`Total Proveedores: ${provider.length}`).alignment('right').bold().fontSize(10).margin(10).end
  ); 
    pdf.add(
        new Txt('Nómina de Proveedores').alignment('center').bold().fontSize(14).margin(10).end
    );   
    pdf.add(
      new Table([
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
    ]).widths([40,120,120,80,60,100,80,60]).fontSize(12).end
    );

    provider.sort(this.sortProvider)
    provider.forEach((item)=>{
        pdf.add(
            new Table([
                [
                  new Txt(String(item.id_provider!)).end,
                  new Txt(item.provider_name!).end,
                  new Txt(item.provider_email!).end,
                  new Txt(item.provider_address!).end,
                  new Txt(item.provider_landline!).end,
                  new Txt(item.provider_phone!).end,
                  new Txt(String(item.provider_response_time_day)+ ' Días y ' + String(item.provider_response_time_hour) + ' Horas').end,
                  new Txt(item.provider_status == 1 ? 'Activo' : 'Inactivo').end,
                ]
            ]).widths([40,120,120,80,60,100,80,60]).fontSize(10).end
        );
    })
    pdf.footer((currentPage : any, pageCount : any)=>{
      return new Txt(`Pág. ${currentPage}/${pageCount}`).color('#3f3f3f').margin([20,5,40,20]).alignment('right').fontSize(10).end;
    });
    pdf.create().open();    
  }

  sortProvider(x:any , y:any){
    if(x.provider_name < y.provider_name) return -1;
    if(x.provider_name > y.provider_name) return 1;
    return 0;
  }
}
