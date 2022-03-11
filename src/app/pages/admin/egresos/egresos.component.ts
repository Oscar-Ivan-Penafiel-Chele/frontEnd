import { Component, OnInit } from '@angular/core';
import { Egreso } from 'src/app/models/egreso';
import { RestService } from 'src/app/services/rest.service';
import { Cell, Columns, PdfMakeWrapper, QR, Table, Toc, Txt  } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";

PdfMakeWrapper.setFonts(pdfFonts);

@Component({
  selector: 'app-egresos',
  templateUrl: './egresos.component.html',
  styleUrls: ['./egresos.component.css']
})
export class EgresosComponent implements OnInit {

  egresos : Egreso[] = [];
  egresosAux : Egreso[] = [];
  
  egreso : Egreso = {} as Egreso;
  loading : boolean = false;
  fechaInicio : any;
  fechaFin : any;

  constructor(
    private _rest : RestService
  ) { }

  ngOnInit(): void {
    this.getEgresos();
  }

  getEgresos(){
    this.loading = true;
    this._rest.getEgresos().subscribe((response : Egreso[])=>{
      this.egresos = Object.values(response);
      this.loading = false;
      console.log(this.egresos);
    })
  }

  openModal(egreso : any){
   
  }

  exportPDF(){
    this.egresosAux = [];

    this.egresosAux = this.egresos.filter((i)=> new Date(i.create_date).setHours(0,0,0,0).valueOf() >= (this.fechaInicio).valueOf() && new Date(i.create_date).setHours(0,0,0,0).valueOf() <= (this.fechaFin).valueOf() );
    
    const fecha = new Date();
        const pdf = new PdfMakeWrapper();
        pdf.info({
            title: 'Reporte de Egresos',
            author: '@Yebba',
            subject: 'Mostrar los productos de la ferretería',
        });
        pdf.pageSize('A4');
        pdf.pageOrientation('portrait'); // 'portrait'
        pdf.header(fecha.toUTCString());
        pdf.add(
            new Txt('Reporte de Ingresos').alignment('center').bold().fontSize(16).margin(10).end
        );   
        pdf.add(
            new Table([
                [ 'Código','Nombre','Proveedor', 'Marca','Categoría','Medida','Stock','Estado',],
            ]).widths([ 80,100,100,'*',100,100,80,80 ]).fontSize(14).bold().end
        );
        this.egresos.forEach((item)=>{
            pdf.add(
                new Table([
                  []
                    //[ item.product_code , item.product_name , item.provider.provider_name , item.brand.brand_name, item.category.category_name, item.product_unit.name_product_unit, item.product_stock , item.product_status == 1 ? 'Activo' : 'Inactivo' ],
                ]).widths([ 80,100,100,'*',100,100,80,80 ]).end
            );
        })
        pdf.create().open();
  }
}
