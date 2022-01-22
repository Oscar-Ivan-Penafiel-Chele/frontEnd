import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-dashboard-employee',
  templateUrl: './dashboard-employee.component.html',
  styleUrls: ['./dashboard-employee.component.css']
})
export class DashboardEmployeeComponent implements OnInit {

  isHidden : boolean = true;
  i : number = 0;
 
  constructor(private primengConfig: PrimeNGConfig, private _routerNavigation : Router) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.activeFirstLink();
  }

  showNavbar (){
    const nav = document.querySelector('.nav__aside');
    const icon = document.querySelector('.icon-toggle');

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

  activeFirstLink(){
    const links = document.querySelectorAll('.nav__aside__item');
    
    links[0].classList.add('active');
  }

  activeLink(){
    const links = document.querySelectorAll('.nav__aside__item');

    console.log("Primer click");
    links.forEach( l => l.addEventListener('click', () =>{
      // if(l == links[0] && this.i == 0){
      //   return ;
      // }else{
        this.i = 1;
        links.forEach(j => j.classList.remove('active'));
        l.classList.add('active');
      // }
      }),
    );
  }

  logOut(){
    this._routerNavigation.navigate(['login']);
  }
}
