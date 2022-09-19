import { Component, OnInit } from '@angular/core';
import { IProvider, IPurchaseOrder, User} from '@models/interfaces';
import { ProviderService } from 'src/app/pages/admin/provider/service/provider.service';
import {MessageService, PrimeNGConfig} from 'primeng/api';
import { PurchaseOrderService } from 'src/app/pages/admin/purchase_order/service/purchase-order.service';
import { GeneratePdfStatisticsPurchaseOrderService } from 'src/app/shared/services/pdfs/generate-pdf-statistics-purchase-order.service';
import { TokenService } from 'src/app/auth/service/token.service';
import { PdfMakeWrapper } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";

PdfMakeWrapper.setFonts(pdfFonts);

@Component({
  selector: 'app-statistics-purchase',
  templateUrl: './statistics-purchase.component.html',
  styleUrls: ['./statistics-purchase.component.css']
})
export class StatisticsPurchaseComponent implements OnInit {

  fechaInicio : any;
  fechaFin : any;
  providers: IProvider[] = [];
  selectedProvider: IProvider[] = [];
  selectedState: number | undefined;
  options: any[] = [];
  purchase_orders: IPurchaseOrder[] = [];
  purchase_ordersAux: IPurchaseOrder[] = [];
  user: User = {};
  submitted: boolean = false;

  isShowMessageDateInit : boolean = false;
  isShowMessageDateExpiry: boolean = false;
  messageErrorDateInit: string = "";
  messageErrorDateExpiry : string = "";
  disableButton: boolean = false;

  constructor(
    private config: PrimeNGConfig,
    private providersService: ProviderService,
    private tokenService: TokenService,
    private messageService: MessageService,
    private orderPurchaseService: PurchaseOrderService,
    private generatePDFPurchaseOrder: GeneratePdfStatisticsPurchaseOrderService
  ) {
    this.options = [
      {id: '1', name : 'Completado'},
      {id: '0', name : 'Pendiente'},
      {id: '3', name : 'Todos'},
    ];
    this.config.setTranslation({
      "clear" : "Vaciar",
      "today" : "Hoy",
      "dayNamesMin": ["D","L","M","X","J","V","S"],
      "monthNames": ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
      "monthNamesShort": ["Ene", "Feb", "Mar", "Abr", "May", "Jun","Jul", "Ago", "Set", "Oct", "Nov", "Dic"],
    });
  }

  ngOnInit(): void {
    this.getProviders();
    this.getOrdersPurchase();
    this.getUser();
  }

  getUser(){
    this.user = this.tokenService.getTokenDataUser();
  }

  getOrdersPurchase(){
    this.orderPurchaseService.getPurchaseOrders().subscribe((response: any)=>{
      this.purchase_ordersAux = Object.values(response);
      this.purchase_orders = this.purchase_ordersAux;
    }, err =>{
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Ocurrio un problema en el servidor'});
    })
  }

  getProviders(){
    this.providersService.getProviders().subscribe((response: any)=>{
      this.providers = response;
      this.providers = this.providers.filter(i => i.provider_status == 1 && i.provider_qualified == 1);
    }, err=>{
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Ocurrio un problema en el servidor'});
    })
  }

  validateData(){
    if(!this.fechaInicio || !this.fechaFin || this.fechaFin < this.fechaInicio)return false;
    return true;
  }

  async generateReport(){
    this.submitted = true;

    this.purchase_orders = this.purchase_ordersAux;
    let arrayProviders: string[] = [];

    this.selectedProvider.forEach((response: IProvider)=>{
      arrayProviders.push(response.provider_name!);
    });

    this.purchase_orders = this.purchase_orders.filter((i : any) => new Date(i.create_date).setHours(0,0,0,0).valueOf() >= (this.fechaInicio).valueOf() && new Date(i.create_date).setHours(0,0,0,0).valueOf() <= (this.fechaFin).valueOf());

    if(this.selectedProvider.length > 0){
      this.purchase_orders = this.purchase_orders.filter((i: any) => arrayProviders.includes(i.provider.provider_name));
    };

    if(this.selectedState != undefined){
      if(this.selectedState != 3){
        this.purchase_orders = this.purchase_orders.filter(i => i.purchase_order_status == this.selectedState);
      }
    }

    if(this.purchase_orders.length == 0){
      this.messageService.add({severity:'info', summary: 'Info', detail: 'No se encontraron resultados en el rango de fechas elegidas'});
      return;
    }

    this.generatePDFPurchaseOrder.generatePDF(this.purchase_orders, this.user, this.fechaInicio, this.fechaFin);
  }

  isObjEmpty(obj : any) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) return false;
    }
    return true;
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
