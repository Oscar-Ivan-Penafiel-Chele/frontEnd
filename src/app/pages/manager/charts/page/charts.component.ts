import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { Category } from '@models/interfaces';
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

  categories : Category[] = [];

  constructor(
    private primengConfig: PrimeNGConfig,
    private chartService : ChartsService,
    ) { }

  ngOnInit(): void {
    this.getCategoriesProducts();
    this.actionSelect = "sails"
    this.primengConfig.ripple = true;
    
    this.getGraphycDataProducts();
    this.getGraphycDataSails();
    this.getGraphycDataStock();
  }

  getCategoriesProducts(){
    this.completeLoadingProducts = true;
    this.completeLoadingSails = true;
    this.completeLoadingSailsman = true;
    this.chartService.getCategoriesProducts().subscribe((response)=>{
      this.categories = Object.values(response);
      this.categories.map((i : Category)=>{
        if(i.category_name != 'NO DEFINIDO'){
          this.labelsDataProducts.push(i.category_name); 
          this.dataProductsCount.push(i.producto_count) ;
        }
      });
      this.completeLoadingProducts = false;
      this.completeLoadingSails = false;
      this.completeLoadingSailsman = false;
    });
  }


  getGraphycDataProducts(){
    this.dataProducts = {
      labels: this.labelsDataProducts,
            datasets: [
                {
                    label: 'Categorías',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    pointBackgroundColor: 'rgba(255,99,132,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(255,99,132,1)',
                    data: this.dataProductsCount
                }
            ]
    };
  }

  getGraphycDataSails(){
    this.dataSails = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
            label: 'Ventas',
            data: [28, 48, 40, 19, 86, 27, 90],
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
