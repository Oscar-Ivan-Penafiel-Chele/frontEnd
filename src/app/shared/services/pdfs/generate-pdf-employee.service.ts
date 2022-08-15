import { Injectable } from '@angular/core';
import { User } from '@models/interfaces';
import { Canvas, Columns, Img, Line, PdfMakeWrapper, Rect, Stack, Table, Txt  } from 'pdfmake-wrapper';

@Injectable({
  providedIn: 'root'
})
export class GeneratePdfEmployeeService {

  constructor() { }

  async generatePDF(user: User, users: User[]){
    const fecha = new Date();
    const pdf = new PdfMakeWrapper();
    pdf.info({
        title: 'PDF Empleados',
        author: '@Yebba',
        subject: 'Mostrar los empleados de la ferretería',
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
                new Txt('Nómina de Empleados').fontSize(14).bold().end,
              ]).color('#3f3f3f').end,
              new Columns([ 
                new Txt('Módulo de Empleados  \n\n').fontSize(11).end,
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
      '\n\n'
    )
    pdf.add(
        new Txt('Nómina de Empleados').alignment('center').bold().fontSize(11).margin(10).end
    );   
    pdf.add(
      new Table([
        [
            new Txt('Identificación').bold().end,
            new Txt('Apellidos').bold().end,
            new Txt('Nombres').bold().end,
            new Txt('Rol').bold().end,
            new Txt('Teléfono').bold().end,
            new Txt('Correo Electrónico').bold().end,
            new Txt('Estado').bold().end,
        ],
    ]).widths([ 80,100,100,80,100,'*',50]).fontSize(9).end
    );

    users.sort(this.sortEmployee);
    users.forEach((item)=>{
        pdf.add(
            new Table([
                [
                  new Txt(item.user_document!).end,
                  new Txt(item.user_lastName!).end,
                  new Txt(item.user_name!).end,
                  new Txt(item.role_user.role_description).end,
                  new Txt(item.user_phone!).end,
                  new Txt(item.email!).end,
                  new Txt(item.user_status == 1 ? 'Activo' : 'Inactivo').end,
                ]
            ]).widths([ 80,100,100,80,100,'*',50 ]).fontSize(9).end
        );
    })

    pdf.footer((currentPage : any, pageCount : any)=>{
      return new Txt(`Pág. ${currentPage}/${pageCount}`).color('#3f3f3f').margin([20,5,40,20]).alignment('right').fontSize(9).end;
    });
    pdf.create().open();    
  }

  sortEmployee(x:any , y:any){
    if(x.user_lastName < y.user_lastName) return -1;
    if(x.user_lastName > y.user_lastName) return 1;
    return 0;
  }
}
