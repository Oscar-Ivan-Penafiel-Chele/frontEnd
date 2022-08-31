import { Injectable } from '@angular/core';
import { User } from '@models/interfaces';
import { Canvas, Cell, Columns, Img, ITable, Line, PdfMakeWrapper, Stack, Table, Txt  } from 'pdfmake-wrapper';

type TableRow = [];

@Injectable({
  providedIn: 'root'
})
export class GeneratePdfEmployeeService {

  constructor() { }

  async generatePDF(user: User, users: User[]){
    users.sort(this.sortEmployee);

    const fecha = new Date();
    const pdf = new PdfMakeWrapper();
    let dataNow = (fecha.getFullYear() < 10 ? '0'+fecha.getFullYear() : fecha.getFullYear())+"-"+((fecha.getMonth()+1) < 10 ? '0'+(fecha.getMonth()+1) : (fecha.getMonth()+1))+"-"+ (fecha.getDate() < 10 ? '0'+fecha.getDate() : fecha.getDate())+" "+(fecha.getHours() < 10 ? '0'+fecha.getHours() : fecha.getHours())+":"+(fecha.getMinutes() < 10 ? '0'+fecha.getMinutes() : fecha.getMinutes())+":"+(fecha.getSeconds() < 10 ? '0'+fecha.getSeconds() : fecha.getSeconds());


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
      '\n'
    )
    
    pdf.add(
      new Txt(`${users.length} ${users.length < 2 ? 'Empleado' : 'Empleados'}`).alignment('right').bold().fontSize(10).margin(10).end
    ); 

    pdf.add(
        new Txt('Nómina de Empleados').alignment('center').bold().fontSize(11).margin(10).end
    );   

    pdf.add(this.createTable(users));



    pdf.footer((currentPage : any, pageCount : any)=>{
      return new Txt(`Pág. ${currentPage}/${pageCount}`).color('#3f3f3f').margin([20,5,40,20]).alignment('right').fontSize(7).end;
    });
    pdf.create().download(`${dataNow} Empleados`)   
  }

  sortEmployee(x:any , y:any){
    if(x.user_lastName < y.user_lastName) return -1;
    if(x.user_lastName > y.user_lastName) return 1;
    return 0;
  }

  createTable(data : any): ITable{
    return new Table([
      [ 
        new Txt('Identificación').bold().end,
        new Txt('Apellidos').bold().end,
        new Txt('Nombres').bold().end,
        new Txt('Rol').bold().end,
        new Txt('Teléfono').bold().end,
        new Txt('Correo Electrónico').bold().end,
        new Txt('Estado').bold().end,
      ],
      ...this.extractData(data),
    ]).keepWithHeaderRows(1).headerRows(1).color('#3f3f3f').widths([80,100,100,80,100,'*',50]).fontSize(9).end;
  }

  extractData(data : any) : TableRow{
    return data.map((row : any) => [row.user_document, row.user_lastName, row.user_name, row.role_user.role_description , row.user_phone, row.email, `${row.user_status == 1 ? 'Activo' : 'Inactivo'}`])
  }
}
