import { Component, OnInit } from '@angular/core';
import { Ingreso, User } from '@models/interfaces';
import { PrimeNGConfig , MessageService } from 'primeng/api';
import { Canvas, Columns, Img, ITable, Line, PdfMakeWrapper, Stack, Table, Txt  } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { TokenService } from 'src/app/auth/service/token.service';
import { IngresosService } from '../service/ingresos.service';
import { GeneratePdfReportIngresosService } from 'src/app/shared/services/pdfs/generate-pdf-report-ingresos.service';

PdfMakeWrapper.setFonts(pdfFonts);
type TableRow = [];

@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.css'],
  providers: [MessageService]
})
export class IngresosComponent implements OnInit {

  user : User = {};
  loading : boolean = false;

  ingresos : Ingreso[] = [];
  ingresosAux : Ingreso[] = [];
  fechaInicio : any;
  fechaFin : any;


  isShowMessageDateInit : boolean = false;
  isShowMessageDateExpiry: boolean = false;
  messageErrorDateInit: string = "";
  messageErrorDateExpiry : string = "";
  disableButton: boolean = false;

  constructor(
    private ingresoService : IngresosService,
    private config: PrimeNGConfig,
    private _token : TokenService,
    private messageService: MessageService,
    private reportIngresoPDFService: GeneratePdfReportIngresosService
  ) {
    this.config.setTranslation({
      "clear" : "Vaciar",
      "today" : "Hoy",
      "dayNamesMin": ["D","L","M","X","J","V","S"],
      "monthNames": ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
    });
   }

  ngOnInit(): void {
    this.getIngresos(false);
    this.getDataProfile();
    this.refreshData();
  }

  getDataProfile(){
    const data = this._token.getTokenDataUser();
    this.user = data;
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

  refreshData(){
    setInterval(()=>{
      this.getIngresos(true);
    },100000);
  }

  getIngresos(isRefresh: boolean){
    if(!isRefresh) this.loading = true;
    this.ingresoService.getIngresos().subscribe((response : Ingreso[])=>{
      this.ingresos = Object.values(response);
      if(!isRefresh) this.loading = false;
    })
  }

  async exportPdf(){
    this.ingresosAux = [];
    this.ingresosAux = this.ingresos.filter((i)=> new Date(i.create_date).setHours(0,0,0,0).valueOf() >= (this.fechaInicio).valueOf() && new Date(i.create_date).setHours(0,0,0,0).valueOf() <= (this.fechaFin).valueOf() );

    if(this.ingresosAux.length == 0) {
      this.messageService.add({severity:'success', summary: 'Completado', detail: 'No se encontraron registros en el rango de fechas elegidas', life : 4000});
      return ;
    };

    this.reportIngresoPDFService.generatePDF(this.ingresosAux, this.user, this.fechaInicio, this.fechaFin);
  }

  onSelectDateExpiry($event : any){
    this.handleDate($event);
  }

  onSelectDateInit($event : any){
    this.handleDate($event);
  }

  handleDate($event : any){
    this.validateDatesSelected();
  }

  validateDatesSelected(){
    if(this.fechaFin < this.fechaInicio) {
      this.messageErrorDateExpiry = "Fecha fin no puede se menor a la fecha de inico" ;
      this.isShowMessageDateExpiry = true ;
      this.isShowMessageDateInit = false
      return ;
    }

    if(this.fechaInicio > this.fechaFin) {
      this.messageErrorDateInit = "Fecha de inicio no puede se mayor a la fecha fin" ;
      this.isShowMessageDateInit = true ;
      this.isShowMessageDateExpiry = false
      return ;
    }

    this.messageErrorDateExpiry = "" ;
    this.isShowMessageDateExpiry = false ;
    this.isShowMessageDateInit = false;
    return;
  }

}
