import { Component, OnInit } from '@angular/core';
import { MessageService, Message, ConfirmationService, PrimeNGConfig } from 'primeng/api';
import { ISailResponse, Sail, User } from '@models/interfaces';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { PdfMakeWrapper } from 'pdfmake-wrapper';
import { TokenService } from 'src/app/auth/service/token.service';
import { ReportSailService } from '../service/report-sail.service';
import { GeneratePdfFacturaService } from 'src/app/shared/services/pdfs/generate-pdf-factura.service';
import { GenerateReportSailService } from 'src/app/shared/services/pdfs/generate-report-sail.service';

PdfMakeWrapper.setFonts(pdfFonts);

@Component({
  selector: 'app-report-sail',
  templateUrl: './report-sail.component.html',
  styleUrls: ['./report-sail.component.css'],
  providers : [MessageService,ConfirmationService]
})
export class ReportSailComponent implements OnInit {

  fechaInicio : any;
  fechaFin : any;
  loading : boolean = false;
  sails : Sail[] = [];

  sailAux : any = [];
  user : User = {};

  products : any = [];
  subtotal : number = 0;
  iva : any = 0;
  total : any = 0;
  dataAux : any = [];
  tableData : ISailResponse[] = [];
  prueba : ISailResponse[] = [];

  isShowMessageDateInit : boolean = false;
  isShowMessageDateExpiry: boolean = false;
  messageErrorDateInit: string = "";
  messageErrorDateExpiry : string = "";
  disableButton: boolean = false;

  constructor(
    private reportSailService : ReportSailService,
    private _token : TokenService,
    private config: PrimeNGConfig,
    private messageService: MessageService,
    private generatePDFService : GeneratePdfFacturaService,
    private generateReportService : GenerateReportSailService
  ) {
    this.config.setTranslation({
      "clear" : "Vaciar",
      "today" : "Hoy",
      "dayNamesMin": ["D","L","M","X","J","V","S"],
      "monthNames": ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
      "monthNamesShort": ["Ene", "Feb", "Mar", "Abr", "May", "Jun","Jul", "Ago", "Set", "Oct", "Nov", "Dic"],
    });
  }

  ngOnInit(): void {
    this.getSails(false);
    this.getDataProfile();
  }

  refreshData(){
    setInterval(()=>{
      this.getSails(true);
    },100000);
  }


  getSails(isRefresh: boolean){
    if(!isRefresh) this.loading = true;
    this.reportSailService.getSails().subscribe((response : Sail[])=>{
      this.sails = Object.values(response);
      this.groupOrderByIdOrder(response, isRefresh);
    }, err=>{
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un error en el servidor', life: 3000});
    })
  }

  groupOrderByIdOrder(response : any, isRefresh: boolean){
    let data : any = {};

    response.forEach((i : any)=>{
      if(!data.hasOwnProperty(i.id_order)){
        data[i.id_order] = {
          orders : []
        }
      }

      data[i.id_order].orders.push({i});
    });

    this.sails = Object.values(data);
    if(!isRefresh) this.loading = false;
    this.createInterfaceTable(this.sails)
  }

  createInterfaceTable(sails : Sail[]){
    sails.forEach((sail : any) =>{
      this.tableData.push(
        {
          name_sail : sail.orders[0].i.order.user.user_name,
          lastName_sail : sail.orders[0].i.order.user.user_lastName,
          date_creation : sail.orders[0].i.create_date,
          description_sail : sail.orders[0].i.inventory_description,
          voucher_sail : sail.orders[0].i.order.voucher_number,
          sail : sail.orders,
        }
      );
    });

    this.prueba = Object.values(this.tableData)
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

  async generatePDF(pedido : any){
    this.generatePDFService.generateFacturePDF({orders : pedido});
  }

  async generateReport(){
    this.sailAux = [];

    this.sailAux = this.sails.filter((i : any)=> new Date(i.orders[0].i.create_date).setHours(0,0,0,0).valueOf() >= (this.fechaInicio).valueOf() && new Date(i.orders[0].i.create_date).setHours(0,0,0,0).valueOf() <= (this.fechaFin).valueOf() );

    if(this.sailAux.length == 0){
      this.messageService.add({severity:'info', summary: 'Info', detail: 'No se encontraron registros en el rango de fechas elegidas', life : 4000});
      return ;
    }

    this.generateReportService.generateReport(this.sails, this.fechaInicio, this.fechaFin, this.user);
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
