import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

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

  constructor(private primengConfig: PrimeNGConfig) { }

  ngOnInit(): void {
    this.actionSelect = "sails"
    this.primengConfig.ripple = true;
    
    this.getGraphycDataProducts();
    this.getGraphycDataSails();
    this.getGraphycDataStock();
  }

  getGraphycDataProducts(){
    this.dataProducts = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
          {
              label: 'My First dataset',
              backgroundColor: '#42A5F5',
              data: [65, 59, 80, 81, 56, 55, 40]
          },
          {
              label: 'My Second dataset',
              backgroundColor: '#FFA726',
              data: [28, 48, 40, 19, 86, 27, 90]
          },
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
      datasets: [{
        data: [
            11,
            16,
            7,
            3,
            14
        ],
        backgroundColor: [
            "#42A5F5",
            "#66BB6A",
            "#FFA726",
            "#26C6DA",
            "#7E57C2"
        ],
        label: 'My dataset'
        }],
        labels: [
            "Red",
            "Green",
            "Yellow",
            "Grey",
            "Blue"
        ]
    }
  }
}
