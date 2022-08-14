import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { Category, ICardAmin } from '@models/interfaces';
import { ChartsService } from '../service/charts.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
  basicOptions: any;
  dataSails : any;
  dataProducts : any;
  dataUsers : any;
  dataStock : any;
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

  constructor(
    private primengConfig: PrimeNGConfig,
    private chartService : ChartsService,
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
     }

  ngOnInit(): void {
    this.actionSelect = "sails"
    this.primengConfig.ripple = true;
    this.getGraphycDataSails();
    this.getGraphycDataStock();
    this.getSails();
    this.getProductsByCategory();
    this.getOrders();
  }

  getSails(){
    const dataCard: ICardAmin = {} as ICardAmin;

    this.isLoading = true;
    this.chartService.getSails().subscribe((response)=>{
      console.log(response)
      dataCard.class = "card__option__item ventas";
      dataCard.action = "sails"
      dataCard.title = "Ventas";
      dataCard.icon = "pi pi-shopping-cart"
      dataCard.amount = response.count;


      this.options.push(dataCard);
      this.isLoading = false;

    }, err =>{

    })
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

  getOrders(){
    const dataCard: ICardAmin = {} as ICardAmin;
    this.isLoading = true;
    this.chartService.getOrders().subscribe((response)=>{
      dataCard.class = "card__option__item stock";
      dataCard.action = "sailman"
      dataCard.title = "Pedidos";
      dataCard.icon = "pi pi-user"
      dataCard.amount = response.data.length;

      this.options.push(dataCard);
      this.isLoading = false;
    }, err =>{

    })
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

  getGraphycDataSails(){
    this.dataSails = {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
      datasets: [
        {
            label: 'Ventas',
            data: [28, 35, 40, 30, 56, 67, 50,79, 88, 99, 119, 40],
            fill: false,
            borderColor: '#FFA726',
            tension: .4
        }
      ]
    };
  }

  getGraphycDataStock(){
    this.dataStock = {
      labels: ['A','B','C'],
            datasets: [
                {
                    data: [300, 50, 100],
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56"
                    ],
                    hoverBackgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56"
                    ]
                }
            ]
    }
  }
}
