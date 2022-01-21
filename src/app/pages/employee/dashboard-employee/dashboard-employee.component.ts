import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-dashboard-employee',
  templateUrl: './dashboard-employee.component.html',
  styleUrls: ['./dashboard-employee.component.css']
})
export class DashboardEmployeeComponent implements OnInit {

  isHidden : boolean = true;

  constructor(private primengConfig: PrimeNGConfig) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  showNavbar (){
    const icon = document.querySelector('.icon-toggle');
    const nav = document.querySelector('.nav__aside');
    
    if(icon?.classList[1] == 'pi-bars'){
      icon?.classList.replace('pi-bars','pi-times');
      nav?.classList.remove('hide');
      nav?.classList.add('show');
      setTimeout(() => {
        this.isHidden = false;
      }, 200);
    }else{
      this.isHidden = true;
      nav?.classList.remove('show');
      nav?.classList.add('hide');
      icon?.classList.replace('pi-times','pi-bars');
    }
  }
}
