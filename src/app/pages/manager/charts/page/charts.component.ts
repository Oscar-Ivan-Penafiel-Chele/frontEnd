import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { Category, ICardAmin } from '@models/interfaces';
import { ChartsService } from '../service/charts.service';
import {MessageService} from 'primeng/api';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css'],
  providers: [MessageService]
})
export class ChartsComponent implements OnInit {

  dateCurrent: Date = new Date();
  monthCurrent: string = this.dateCurrent.toLocaleString('es-ES', {month: 'long'});
  nameMonthCurrent: string = this.monthCurrent.charAt(0).toUpperCase() + this.monthCurrent.slice(1);

  basicOptions: any;
  dataSails : any;
  dataOrders : any;
  dataProducts : any;
  dataUsers : any;
  dataTypePay : any;
  actionSelect : string = "";
  labelsDataProducts : any[] = [];
  dataProductsCount : any[] = [];
  completeLoadingProducts : boolean = false;
  completeLoadingSails : boolean = false;
  completeLoadingSailsman: boolean = false;
  options: any[] = [];
  isLoading: boolean = false;

  productsByCategory: any[] = [];

  data: any;

  backgroundColors: any[] = [];

  categories : Category[] = [];


  fechaInicioPay: string = "";
  fechaFinPay: string = "";
  fechaInicioSail: string = "";
  fechaFinSail: string = "";
  fechaInicioOrder: string = "";
  fechaFinOrder: string = "";

  fechaInicio : any;
  fechaFin : any;
  isShowMessageDateInit : boolean = false;
  isShowMessageDateExpiry: boolean = false;
  messageErrorDateInit: string = "";
  messageErrorDateExpiry : string = "";
  disableButton: boolean = false;

  isShowMessageDateInitSail : boolean = false;
  isShowMessageDateExpirySail: boolean = false;
  messageErrorDateInitSail: string = "";
  messageErrorDateExpirySail: string = "";


  isShowMessageDateInitOrder : boolean = false;
  isShowMessageDateExpiryOrder: boolean = false;
  messageErrorDateInitOrder: string = "";
  messageErrorDateExpiryOrder : string = "";

  constructor(
    private primengConfig: PrimeNGConfig,
    private chartService : ChartsService,
    private messageService: MessageService,
    ) {
      this.backgroundColors = [
        "#42A5F5",
        "#66BB6A",
        "#FFA726",
        "#26C6DA",
        "#7E57C2",
        "#FF6384",
        "#f83600",
        "#b31217",
        "#e65245"
      ]

      this.primengConfig.setTranslation({
        "clear" : "Vaciar",
        "today" : "Hoy",
        "dayNamesMin": ["D","L","M","X","J","V","S"],
        "monthNames": ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
        "monthNamesShort": ["Ene", "Feb", "Mar", "Abr", "May", "Jun","Jul", "Ago", "Set", "Oct", "Nov", "Dic"],
      });
     }

  ngOnInit(): void {
    this.actionSelect = "orders"
    this.primengConfig.ripple = true;
    this.getOrders();
    this.getSails();
    this.getProductsByCategory();
    this.getTypePayData();
  }

  getOrders(){
    const dataCard: ICardAmin = {} as ICardAmin;
    let arrayData: number[] = [];
    let labelsPurchase: string[] = [];
    this.isLoading = true;
    this.chartService.getOrders({}).subscribe((response)=>{

      dataCard.class = "card__option__item compras";
      dataCard.action = "orders"
      dataCard.title = "Compras";
      dataCard.icon = "pi pi-sign-in"
      dataCard.amount = response.count.Compras;

      arrayData = Object.values(response.data);
      labelsPurchase = Object.keys(response.data);

      this.options.push(dataCard);
      this.isLoading = false;

      this.getGraphycsOrder(arrayData, labelsPurchase, true, this.nameMonthCurrent);

    }, err =>{
      console.log(err)
    })
  }

  getOrdersFilter(){
    let fechaI = new Date(this.fechaInicioOrder);
    let fechaF = new Date(this.fechaFinOrder)
    let arrayDates: string[] = [];
    let anioI;
    let anioF;
    let monthI;
    let monthF;
    let data = {}

    let monthCurrent = fechaI.toLocaleString('es-ES', {month: 'long'});

    anioI = fechaI.getFullYear();
    anioF = fechaF.getFullYear();
    monthI = ((fechaI.getMonth() + 1) < 10 ? '0'+(fechaI.getMonth() + 1) : (fechaI.getMonth() + 1));
    monthF = ((fechaF.getMonth() + 1) < 10 ? '0'+(fechaF.getMonth() + 1) : (fechaF.getMonth() + 1));

    if((this.fechaInicioOrder  && !this.fechaFinOrder) || (monthI == monthF)){
      let date = fechaI.getFullYear() + '-' + ( (fechaI.getMonth() + 1) < 10 ? '0'+(fechaI.getMonth() + 1) : (fechaI.getMonth() + 1));
      arrayDates.push(date);

      data = {fechas: arrayDates}
      this.requestOrdersFilter(data, false, true, monthCurrent.charAt(0).toUpperCase() + monthCurrent.slice(1));
      return;
    }

    if(this.fechaInicioOrder  && this.fechaFinOrder){
      for (let index = parseInt(monthI.toString()); index <= parseInt(monthF.toString()); index++) {
        arrayDates.push(`2022-${index < 10 ? '0'+index : index}`);
      }

      data = {fechas: arrayDates}
      this.requestOrdersFilter(data, false, false, "");
      return;
    }
  }

  requestOrdersFilter(data: any, clearInputs: boolean, isOnlyDate: boolean , nameMonth: string){
    let arrayData: number[] = [];
    let labelsPurchase: string[] = [];

    this.chartService.getOrders(data).subscribe((response: any)=>{
      arrayData = Object.values(response.data);
      labelsPurchase = Object.keys(response.data);

      this.getGraphycsOrder(arrayData, labelsPurchase, isOnlyDate, nameMonth);
      if(clearInputs) {
        this.fechaFinOrder = "";
        this.fechaInicioOrder = "";
      }
    })
  }


  getGraphycsOrder(arrayData: number[], labelsPurchase: string[], isOnlyDate: boolean , nameMonth: string){
    this.dataOrders = {
      labels: labelsPurchase,
      datasets: [
        {
            label: `${isOnlyDate ? `Compras (${nameMonth})` : 'Compras'}`,
            backgroundColor: '#66BB6A',
            data: arrayData,
        }
      ]
    };
  }


  getProductsByCategory(){
    const dataCard: ICardAmin = {} as ICardAmin;
    this.isLoading = true;
    dataCard.class = "card__option__item productos";
    dataCard.action = "products"
    dataCard.title = "Productos";
    dataCard.icon = "pi pi-tags"

    this.chartService.getProductsByCategory().subscribe((response)=>{
      this.productsByCategory = Object.values(response.data)
      this.productsByCategory = this.productsByCategory.filter(i => i.category_name != 'NO DEFINIDO');
      dataCard.amount = response.count;
      this.options.push(dataCard);

      this.drawGraphyc(this.productsByCategory);
      this.getGraphycDataProducts();
      this.isLoading = false;
    }, err =>{
      console.log(err)
    })
  }

  drawGraphyc(productsByCategory: any): void{
    productsByCategory.forEach((i: any) => {
      this.labelsDataProducts.push(i.category_name);
      this.dataProductsCount.push(i.products);
    });
  }

  getGraphycDataProducts(){
    this.data = {
      datasets: [{
        data: this.dataProductsCount,
        backgroundColor: this.backgroundColors,
      }],
      labels: this.labelsDataProducts
    };
  }


  getSails(){
    const dataCard: ICardAmin = {} as ICardAmin;
    let arrayData: number[] = [];
    let labelsSails: string[] = [];

    this.isLoading = true;
    this.chartService.getSails({}).subscribe((response)=>{

      dataCard.class = "card__option__item ventas";
      dataCard.action = "sails"
      dataCard.title = "Ventas";
      dataCard.icon = "pi pi-shopping-cart"
      dataCard.amount = response.count.Ventas;

      arrayData = Object.values(response.data);
      labelsSails = Object.keys(response.data);

      this.options.push(dataCard);
      this.isLoading = false;

      this.getGraphycDataSails(arrayData, labelsSails, true, this.monthCurrent);
    }, err =>{
      console.log(err)
    })
  }

  getSailsDataFilter(){
    let fechaI = new Date(this.fechaInicioSail);
    let fechaF = new Date(this.fechaFinSail)
    let arrayDates: string[] = [];
    let anioI;
    let anioF;
    let monthI;
    let monthF;
    let data = {}

    anioI = fechaI.getFullYear();
    anioF = fechaF.getFullYear();
    monthI = ((fechaI.getMonth() + 1) < 10 ? '0'+(fechaI.getMonth() + 1) : (fechaI.getMonth() + 1));
    monthF = ((fechaF.getMonth() + 1) < 10 ? '0'+(fechaF.getMonth() + 1) : (fechaF.getMonth() + 1));

    let montCurrent = fechaI.toLocaleString('es-ES', {month: 'long'})

    if((this.fechaInicioSail  && !this.fechaFinSail) || (monthI == monthF)){
      let date = fechaI.getFullYear() + '-' + ( (fechaI.getMonth() + 1) < 10 ? '0'+(fechaI.getMonth() + 1) : (fechaI.getMonth() + 1));
      arrayDates.push(date);

      data = {fechas: arrayDates}
      this.requestFilterSail(data, false, true, montCurrent.charAt(0).toUpperCase() + montCurrent.slice(1));
      return;
    }

    if(this.fechaInicioSail  && this.fechaFinSail){
      for (let index = parseInt(monthI.toString()); index <= parseInt(monthF.toString()); index++) {
        arrayDates.push(`2022-${index < 10 ? '0'+index : index}`);
      }

      data = {fechas: arrayDates}
      this.requestFilterSail(data, false, false, "");
      return;
    }
  }

  requestFilterSail(data: any, clearInputs: boolean, isOnlyDate: boolean , nameMonth: string){
    let arrayData: number[] = [];
    let labelsSails: string[] = [];

    this.chartService.getSails(data).subscribe((response: any)=>{
      arrayData = Object.values(response.data)
      labelsSails = Object.keys(response.data)

      this.getGraphycDataSails(arrayData, labelsSails, isOnlyDate, nameMonth);
      if(clearInputs) {
        this.fechaFinSail = "";
        this.fechaInicioSail = "";
      }
    })
  }


  getGraphycDataSails(arrayData: number[], labelsSails: string[], isOnlyDate: boolean , nameMonth: string){
    this.dataSails = {
      labels: labelsSails,
      datasets: [
        {
            label: `${isOnlyDate ? `Ventas (${nameMonth})` : 'Ventas'}`,
            data: arrayData,
            fill: false,
            borderColor: '#FFA726',
            tension: .4
        }
      ]
    };
  }


  getTypePayData(){
    const dataCard: ICardAmin = {} as ICardAmin;
    this.isLoading = true;
    let arrayData: number[] = [];
    let labelsTypePay: string[] = [];
    let data: any = {};

    this.chartService.getTypePayGraphic(data).subscribe((response: any)=>{
      arrayData = Object.values(response.data);
      labelsTypePay = Object.keys(response.data);

      dataCard.class = "card__option__item stock";
      dataCard.action = "sailman"
      dataCard.title = "Tipos de Pagos";
      dataCard.icon = "pi pi-credit-card"
      dataCard.amount = labelsTypePay.length;

      this.options.push(dataCard);
      this.isLoading = false;

      this.getGraphycDataTypePay(arrayData, labelsTypePay);
    })
  }

  getTypePayDataFilter(){
    let fechaI = new Date(this.fechaInicioPay);
    let fechaF = new Date(this.fechaFinPay)

    let data = {
      "fecha_inicio": fechaI.getFullYear() + '-' + ( (fechaI.getMonth() + 1) < 10 ? '0'+(fechaI.getMonth() + 1) : (fechaI.getMonth() + 1)) + '-' + (fechaI.getDate() < 10 ? '0'+fechaI.getDate() : fechaI.getDate()),
      "fecha_fin": fechaF.getFullYear() + '-' + ( (fechaF.getMonth() + 1) < 10 ? '0'+(fechaF.getMonth() + 1) : (fechaF.getMonth() + 1)) + '-' + (fechaF.getDate() < 10 ? '0'+fechaF.getDate() : fechaF.getDate()),
    };

   this.requestFilterPay(data, false);
  }

  requestFilterPay(data: any, clearInputs: boolean){
    let arrayData: number[] = [];
    let labelsTypePay: string[] = [];

    this.chartService.getTypePayGraphic(data).subscribe((response: any)=>{
      arrayData = Object.values(response.data);
      labelsTypePay = Object.keys(response.data);

      if(arrayData[0] == 0 && arrayData[1] == 0) {
        this.messageService.add({severity:'info', summary: 'Info', detail: 'No se encontraron resultados'});
        return;
      }

      this.getGraphycDataTypePay(arrayData, labelsTypePay);

      if(clearInputs){
        this.fechaFinPay = "";
        this.fechaInicioPay = "";
      }
    })
  }

  getGraphycDataTypePay(data: number[], labels: string[]){
    this.dataTypePay = {
      labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: [
                "#FF6384",
                "#36A2EB",
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
            ]
          }
        ]
    }
  }

  onSelectDateExpiry($event : any){
    this.validateDatesSelected();
  }

  onSelectDateInit($event : any){
    this.validateDatesSelected();
  }

  validateDatesSelected(){
    if(!this.fechaFinPay || !this.fechaInicioPay) return ;

    if(this.fechaFinPay < this.fechaInicioPay) {
      this.messageErrorDateExpiry = "Fecha fin no puede se menor a la fecha de inico" ;
      this.isShowMessageDateExpiry = true ;
      this.isShowMessageDateInit = false
      this.messageService.add({severity:'error', summary: 'Error', detail: `${this.messageErrorDateExpiry}`});
      return ;
    }

    if(this.fechaInicioPay > this.fechaFinPay) {
      this.messageErrorDateInit = "Fecha de inicio no puede se mayor a la fecha fin" ;
      this.isShowMessageDateInit = true ;
      this.isShowMessageDateExpiry = false
      this.messageService.add({severity:'error', summary: 'Error', detail: `${this.messageErrorDateInit}`});
      return ;
    }

    this.messageErrorDateExpiry = "" ;
    this.isShowMessageDateExpiry = false ;
    this.isShowMessageDateInit = false;
    this.messageService.clear();
    return;
  }

  validateDataEmpty(isShowMessageDateInit: boolean, isShowMessageDateExpiry: boolean, fechaInicio: any, fechaFin: any){
    if(isShowMessageDateInit || isShowMessageDateExpiry || !fechaInicio || !fechaFin) return false;

    return true;
  }


  onSelectDateExpirySail($event : any){
    this.validateDatesSelectedSail();
  }

  onSelectDateInitSail($event : any){
    this.validateDatesSelectedSail();
  }

  validateDatesSelectedSail(){
    let anioI = new Date(this.fechaInicioSail).getFullYear();
    let monthI = ((new Date(this.fechaInicioSail).getMonth() + 1) < 10 ? '0'+(new Date(this.fechaInicioSail).getMonth() + 1) : (new Date(this.fechaInicioSail).getMonth() + 1));
    let anioF = new Date(this.fechaFinSail).getFullYear();
    let monthF = ((new Date(this.fechaFinSail).getMonth() + 1) < 10 ? '0'+(new Date(this.fechaFinSail).getMonth() + 1) : (new Date(this.fechaFinSail).getMonth() + 1));

    if(!this.fechaInicioSail || !this.fechaFinSail) return ;

    if((anioI > anioF) || (monthI > monthF)){
      this.messageErrorDateExpirySail = "Fecha fin no puede se menor a la fecha de inico" ;
      this.isShowMessageDateExpirySail = true ;
      this.isShowMessageDateInitSail = false
      this.messageService.add({severity:'error', summary: 'Error', detail: `${this.messageErrorDateExpirySail}`});
      return ;
    }

    this.messageErrorDateExpirySail = "" ;
    this.isShowMessageDateExpirySail = false ;
    this.isShowMessageDateInitSail = false;
    this.messageService.clear();
    return;
  }




  onSelectDateExpiryOrder($event : any){
    this.validateDatesSelectedOrder();
  }

  onSelectDateInitOrder($event : any){
    this.validateDatesSelectedOrder();
  }

  validateDatesSelectedOrder(){
    if(!this.fechaInicioOrder || !this.fechaFinOrder) return ;

    if(this.fechaFinOrder < this.fechaInicioOrder) {
      this.messageErrorDateExpiryOrder = "Fecha fin no puede se menor a la fecha de inico" ;
      this.isShowMessageDateExpiryOrder = true ;
      this.isShowMessageDateInitOrder = false
      this.messageService.add({severity:'error', summary: 'Error', detail: `${this.messageErrorDateExpiryOrder}`});
      return ;
    }

    if(this.fechaInicioOrder > this.fechaFinOrder) {
      this.messageErrorDateInitOrder = "Fecha de inicio no puede se mayor a la fecha fin" ;
      this.isShowMessageDateInitOrder = true ;
      this.isShowMessageDateExpiryOrder = false
      this.messageService.add({severity:'error', summary: 'Error', detail: `${this.messageErrorDateInitOrder}`});
      return ;
    }

    this.messageErrorDateExpiryOrder = "" ;
    this.isShowMessageDateExpiryOrder = false ;
    this.isShowMessageDateInitOrder = false;
    this.messageService.clear();
    return;
  }
}


// var año = 2022;
// var mes = 9;

// var diasMes = new Date(año, mes, 0).getDate();
// console.log(diasMes)

