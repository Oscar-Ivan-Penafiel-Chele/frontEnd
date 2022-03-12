import { Component, OnInit } from '@angular/core';
import { Ingreso } from 'src/app/models/ingreso';
import { PrimeNGConfig ,ConfirmationService, MessageService } from 'primeng/api';
import { RestService } from 'src/app/services/rest.service';
import { Canvas, Cell, Columns, Img, ITable, Line, PdfMakeWrapper, QR, Rect, Stack, Table, Toc, Txt  } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { layouts } from 'chart.js';
import { User } from 'src/app/models/user';
import { TokenService } from 'src/app/services/token.service';

PdfMakeWrapper.setFonts(pdfFonts);
type TableRow = [];

@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.css']
})
export class IngresosComponent implements OnInit {

  user : User = {};
  loading : boolean = false;

  ingresos : Ingreso[] = [];
  ingresosAux : Ingreso[] = [];
  fechaInicio : any;
  fechaFin : any;

  constructor(
    private _rest : RestService,
    private config: PrimeNGConfig,
    private _token : TokenService
  ) {
    this.config.setTranslation({
      "clear" : "Vaciar",
      "today" : "Hoy",
      "dayNamesMin": ["D","L","M","X","J","V","S"],
      "monthNames": ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
    });
   }

  ngOnInit(): void {
    this.getIngresos();
    this.getDataProfile();
  }

  getDataProfile(){
    const data = this._token.getTokenDataUser() as string;
    this.user = JSON.parse(data);
    this.getRoleUser(this.user.id_role!);
  }

  getRoleUser(id_role : number){
    const roles : any= {
      1 : 'Gerente',
      2 : 'Administrador',
      3 : 'Contable',
      4 : 'Vendedor'
    }
  }

  getIngresos(){
    this.loading = true;
    this._rest.getIngresos().subscribe((response : Ingreso[])=>{
      this.ingresos = Object.values(response);
      console.log(this.ingresos);
      this.loading = false;
    })
  }

  async exportPdf(){
    this.ingresosAux = [];

    this.ingresosAux = this.ingresos.filter((i)=> new Date(i.create_date).setHours(0,0,0,0).valueOf() >= (this.fechaInicio).valueOf() && new Date(i.create_date).setHours(0,0,0,0).valueOf() <= (this.fechaFin).valueOf() );
      
    const fecha = new Date();
    const pdf = new PdfMakeWrapper();
    pdf.info({
        title: 'Reporte de Ingresos',
        author: '@Yebba',
        subject: 'Mostrar los productos de la ferretería',
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
                new Txt('Reporte de Ingresos').fontSize(14).bold().end,
              ]).color('#3f3f3f').end,
              new Columns([ 
                new Txt('Módulo de Ingresos  \n\n').fontSize(11).end,
              ]).color('#3f3f3f').end,
              new Columns([ 
                new Txt('').alignment('right').width('*').bold().end,
                new Txt('Usuario: ').alignment('right').width('*').bold().end,
                new Txt(`${this.user.user_name} ${this.user.user_lastName}`).width(60).alignment('right').end,
                new Txt('Fecha: ').alignment('right').width(40).bold().end,
                new Txt(`${fecha.getFullYear()}/${(fecha.getMonth()+1) < 10 ? '0'+(fecha.getMonth()+1) : (fecha.getMonth()+1)}/${fecha.getDate() < 10 ? '0'+fecha.getDate() : fecha.getDate()} `).width(55).alignment('right').end,
                new Txt('Hora:').alignment('right').width(30).bold().end,
                new Txt(`${fecha.getHours()}:${fecha.getMinutes() < 10 ? '0'+fecha.getMinutes() : fecha.getMinutes()} \n\n`).width(30).alignment('right').end,
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
            new Line([0,0], [515,0]).lineColor('#ccc').end
        ]).end,
      ]).width('*').end
    );
    pdf.add(
      '\n\n'
    )
    pdf.add(
      this.createDetailsPDF()
    );
    pdf.add(
      new Txt(`\n ${this.ingresosAux.length} ${this.ingresosAux.length < 2 ? 'Ingreso' : 'Ingresos'}`).alignment('right').bold().fontSize(10).margin(10).end
    );  
    pdf.add(this.createTable(this.ingresosAux));
    pdf.footer((currentPage : any, pageCount : any)=>{
      return new Txt(`Pág. ${currentPage}/${pageCount}`).color('#3f3f3f').margin([20,5,40,20]).alignment('right').fontSize(10).end;
    });
    pdf.create().open();
  }


  createTable(data : any): ITable{
    return new Table([
      [ 'Código Producto','Movimiento','Cantidad Ingresada', 'Descripción','Fecha de Ingreso'],
      ...this.extractData(data),
    ]).widths([ 100,'*',90,60,'*']).color('#3f3f3f').layout('lightHorizontalLines').fontSize(10).end;
  }

  createDetailsPDF(){
    return new Stack([
      new Columns([ 
        new Txt('').bold().width('*').alignment('center').end,
        new Txt('Inicio: ').bold().width(30).alignment('center').end,
        new Txt(`${this.fechaInicio.getFullYear()}/${(this.fechaInicio.getMonth()+1) < 10 ? '0'+(this.fechaInicio.getMonth()+1) : (this.fechaInicio.getMonth()+1)}/${this.fechaInicio.getDate() < 10 ? '0'+this.fechaInicio.getDate() : this.fechaInicio.getDate()} `).width(65).alignment('center').end,
        new Txt('Fin: ').bold().width(20).alignment('center').end,
        new Txt(`${this.fechaFin.getFullYear()}/${(this.fechaFin.getMonth()+1) < 10 ? '0'+(this.fechaFin.getMonth()+1) : (this.fechaFin.getMonth()+1)}/${this.fechaFin.getDate() < 10 ? '0'+this.fechaFin.getDate() : this.fechaFin.getDate()} `).width(65).alignment('center').end,
        new Txt('Movimiento: ').width(55).bold().alignment('center').end,
        new Txt('Ingresos').width(55).alignment('center').end,
        new Txt('').bold().width('*').alignment('center').end,
      ]).alignment('center').end,
    ]).color('#3f3f3f').alignment('center').fontSize(10).end
  }

  extractData(data : any) : TableRow{
    return data.map((row : any) => [row.producto.product_code, row.inventory_movement_type , (row.inventory_stock_amount).split('.')[0] , row.inventory_description, row.create_date])
  }

}
