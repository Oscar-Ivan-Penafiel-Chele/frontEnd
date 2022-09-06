import { Component, OnInit } from '@angular/core';
import { Category, Product, Sail, User } from '@models/interfaces';
import { PrimeNGConfig ,ConfirmationService, MessageService } from 'primeng/api';
import { CategoryService } from 'src/app/pages/admin/category/service/category.service';
import { ProductService } from 'src/app/pages/admin/products/service/product.service';
import { environment } from 'src/environments/environment.prod';
import { StatisticsSailService } from '../service/statistics-sail.service';
import { PdfMakeWrapper } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { GeneratePdfStatisticsSailService } from 'src/app/shared/services/pdfs/generate-pdf-statistics-sail.service';
import { TokenService } from 'src/app/auth/service/token.service';

PdfMakeWrapper.setFonts(pdfFonts);

@Component({
  selector: 'app-statistics-sail',
  templateUrl: './statistics-sail.component.html',
  styleUrls: ['./statistics-sail.component.css'],
  providers : [MessageService,ConfirmationService]
})
export class StatisticsSailComponent implements OnInit {

  fechaInicio : any;
  fechaFin : any;
  loading : boolean = false;
  sails : Sail[] = [];
  sailsAux: any;
  dataSails: any[] = [];

  categories: Category[] = [];
  products: Product[] = [];
  productsAux: Product[] = [];
  selectedCategory: Category[] = [];
  selectedProduct: Product = {} as Product;

  host : string = environment.URL;
  
  user: User = {};
    
  isShowMessageDateInit : boolean = false;
  isShowMessageDateExpiry: boolean = false;
  messageErrorDateInit: string = "";
  messageErrorDateExpiry : string = "";
  disableButton: boolean = false;

  constructor( 
    private config: PrimeNGConfig, 
    private statisticsSailService: StatisticsSailService,
    private messageService: MessageService,
    private categoriesService: CategoryService,
    private productService: ProductService,
    private generatePDFStatisticSail: GeneratePdfStatisticsSailService,
    private _token : TokenService,
    ) { 
    this.config.setTranslation({
      "clear" : "Vaciar",
      "today" : "Hoy",
      "dayNamesMin": ["D","L","M","X","J","V","S"],
      "monthNames": ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
    });
  }

  ngOnInit(): void {
    this.getDataProfile();
    this.getSails();
    this.getCategories();
    this.getProducts();
  }

  getDataProfile(){
    const data = this._token.getTokenDataUser();
    this.user = data;
  }

  getCategories(){
    this.categoriesService.getCategories().subscribe((response: Category[])=>{
      this.categories = Object.values(response);
      this.categories = this.categories.filter(i=> i.category_status == 1 && i.category_name != 'NO DEFINIDO');
      this.categories = this.categories.sort(this.sortCategories);
    },err=>{
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un error en el servidor', life: 3000});
    })
  }

  getProducts(){
    this.productService.getProducts().subscribe((response: Product[])=>{
      this.products = Object.values(response);
      this.products = this.products.filter(i=> i.product_status == 1)
    }, err=>{
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un error en el servidor', life: 3000});
    })
  }

  getSails(){
    this.statisticsSailService.getSails().subscribe((response : Sail[])=>{
      this.sails = Object.values(response);
      this.groupOrderByIdOrder(response);
    }, err=>{
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un error en el servidor', life: 3000});
    })
  }

  groupOrderByIdOrder(response : any){
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
    this.loading = false;
    this.createInterfaceTable(this.sails)
  }

  createInterfaceTable(sails: any){
    sails.forEach((item: any)=>{
      item.orders.forEach((x: any) => {
        console.log(x)
        this.dataSails.push({
          create_date: x.i.create_date,
          voucher: x.i.order.voucher_number,
          category: x.i.order_detail.producto.category.category_name,
          product: x.i.order_detail.producto.product_name,
          identification: x.i.order.user.user_document,
          name: x.i.order.user.user_name + " " + x.i.order.user.user_lastName,
          type_pay: x.i.order.type_pay.pay_description,
          total: x.i.order.order_price_total,
          advanced_details: x.i
        });
      });
    });
  }

  filterAction($event: any){
    let array = $event;
    let arrayAux: any[] = [];

    array.forEach((item: any) => {
      if(!arrayAux.includes(item.category_name)){
        arrayAux.push(item.category_name)
      }
    });

    if(arrayAux.length > 0){
      this.productsAux = this.products.filter(i=> arrayAux?.includes(i.category.category_name));
    }else{
      this.productsAux = this.products;
    }
  }

  async generateReport(){
    let arrayCategory: string[] = [];
    let arrayProduct: string[] = [];

    if(!this.isObjEmpty(this.selectedProduct)){
      arrayProduct.push(this.selectedProduct.product_name!);
    }

    this.selectedCategory.forEach((response: Category)=>{
      arrayCategory.push(response.category_name);
    });

    this.sailsAux = this.dataSails.filter((i : any) => new Date(i.create_date).setHours(0,0,0,0).valueOf() >= (this.fechaInicio).valueOf() && new Date(i.create_date).setHours(0,0,0,0).valueOf() <= (this.fechaFin).valueOf()); 

    if(this.selectedCategory.length > 0){
      this.sailsAux = this.sailsAux.filter((i: any)=> arrayCategory.includes(i.category));
    };

    if(arrayProduct.length > 0){
      this.sailsAux = this.sailsAux.filter((i: any)=> arrayProduct.includes(i.product));
    }

    if(this.sailsAux.length == 0){
      this.messageService.add({severity:'info', summary: 'Info', detail: 'No se encontraron resultados en el rango de fechas elegidas', life: 3000});
      return;
    }

    this.generatePDFStatisticSail.generatePDFStatistic(Object.values(this.sailsAux), this.user, this.fechaInicio, this.fechaFin, this.selectedCategory, this.selectedProduct);
  }

  validateData(){
    if(!this.fechaInicio || !this.fechaFin || this.fechaFin < this.fechaInicio){
      return false;
    }

    return true;
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

  sortCategories(x : any ,y : any){
    if(x.category_name < y.category_name) return -1;
    if(x.category_name > y.category_name) return 1;
    return 0;
}


}
