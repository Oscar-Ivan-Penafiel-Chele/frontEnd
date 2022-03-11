import { Component, OnInit } from '@angular/core';
import { Ingreso } from 'src/app/models/ingreso';
import { PrimeNGConfig ,ConfirmationService, MessageService } from 'primeng/api';
import { RestService } from 'src/app/services/rest.service';
import { Canvas, Cell, Columns, ITable, Line, PdfMakeWrapper, QR, Rect, Table, Toc, Txt  } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { layouts } from 'chart.js';

PdfMakeWrapper.setFonts(pdfFonts);
type TableRow = [];

@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.css']
})
export class IngresosComponent implements OnInit {

  loading : boolean = false;

  ingresos : Ingreso[] = [];
  ingresosAux : Ingreso[] = [];
  fechaInicio : any;
  fechaFin : any;

  constructor(
    private _rest : RestService,
    private config: PrimeNGConfig
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
  }

  getIngresos(){
    this.loading = true;
    this._rest.getIngresos().subscribe((response : Ingreso[])=>{
      this.ingresos = Object.values(response);
      console.log(this.ingresos);
      this.loading = false;
    })
  }

  exportPdf(){
    this.ingresosAux = [];

    this.ingresosAux = this.ingresos.filter((i)=> new Date(i.create_date).setHours(0,0,0,0).valueOf() >= (this.fechaInicio).valueOf() && new Date(i.create_date).setHours(0,0,0,0).valueOf() <= (this.fechaFin).valueOf() );
    
    console.log(this.ingresosAux);
    
    const fecha = new Date();
    const pdf = new PdfMakeWrapper();
    pdf.info({
        title: 'Reporte de Ingresos',
        author: '@Yebba',
        subject: 'Mostrar los productos de la ferretería',
    });
    pdf.pageSize('A4');
    pdf.pageOrientation('portrait'); // 'portrait'
    pdf.header(fecha.toUTCString());
    pdf.add(
      new Txt('Hello world!').alignment('center').italics().end
    );  
    pdf.add(
      new Canvas([
          new Rect([10, 10], [30, 30]).end
      ]).end
  );
    pdf.add(
      new Txt(`${this.ingresosAux.length} Ingresos`).alignment('right').bold().fontSize(12).margin(10).end
    );  
    pdf.add(this.createTable(this.ingresosAux));
    pdf.create().open();
  }

  createTable(data : any): ITable{
    return new Table([
      [ 'Código Producto','Movimiento','Cantidad Ingresada', 'Stock','Fecha de Ingreso'],
      ...this.extractData(data),
    ]).widths([ 100,'*','*',70,'*']).layout('lightHorizontalLines').fontSize(12).end;
  }

  extractData(data : any) : TableRow{
    return data.map((row : any) => [row.producto.product_code, row.inventory_movement_type , row.inventory_stock_amount , row.producto.product_stock, row.create_date])
  }

}
