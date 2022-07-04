import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { TokenService } from 'src/app/services/token.service';
import { PrimeNGConfig } from 'primeng/api';
import {PrimeIcons} from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.css']
})
export class OtherComponent implements OnInit {

  fechaYHora : any ;
  user : User = {};
  roleUser : string = "";
  events1: any[] = [];
  overlayLogout : boolean = false;

  constructor(
    private _token : TokenService,
    private primengConfig: PrimeNGConfig,
    private _navigation : Router
  ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.events1 = [
      {status: 'Ordered', date: '15/10/2020 10:30', icon: PrimeIcons.SHOPPING_CART, color: '#9C27B0', image: 'game-controller.jpg'},
      {status: 'Processing', date: '15/10/2020 14:00', icon: PrimeIcons.COG, color: '#673AB7'},
      {status: 'Shipped', date: '15/10/2020 16:15', icon: PrimeIcons.ENVELOPE, color: '#FF9800'},
      {status: 'Delivered', date: '16/10/2020 10:00', icon: PrimeIcons.CHECK, color: '#607D8B'}
  ];
    this.getDataProfile();
    setInterval(()=>{
      this.getDateToday();
    },100);
    this.activeFirstLink();
    this.activeLink();
  }

  getDataProfile(){
    const data = this._token.getTokenDataUser() as string;
    this.user = JSON.parse(data);
    this.getRoleUser(this.user.id_role!);
  }

  getRoleUser(id_role : number){
    const roles : any= {
      1 : 'Gerente',
      2 : 'Administrador',
      3 : 'Contable',
      4 : 'Vendedor',
      5 : 'Cliente'
    }

    this.roleUser = roles[id_role];
  }

  displayOptions(){
    const menu = document.querySelector('.header__profile');
    const menuOptions = document.querySelector('.profile__options');

    if(menuOptions?.classList.contains('isActiveNavOption')){
      menuOptions.classList.remove('isActiveNavOption');
    }else{
      menuOptions?.classList.add('isActiveNavOption');
    }
  }

  getDateToday(){
    let hoy = new Date();

    let fecha = hoy.getFullYear() + '-' + ( (hoy.getMonth() + 1) < 10 ? '0'+(hoy.getMonth() + 1) : (hoy.getMonth() + 1)) + '-' + (hoy.getDate() < 10 ? '0'+hoy.getDate() : hoy.getDate());
    let hora = (hoy.getHours() < 10 ? '0'+hoy.getHours() : hoy.getHours()) + ':' + (hoy.getMinutes() < 10 ? '0'+hoy.getMinutes() : hoy.getMinutes()) + ':' + (hoy.getSeconds() < 10 ? '0'+hoy.getSeconds() : hoy.getSeconds());

    this.fechaYHora = fecha + ' ' + hora;

  }

  activeFirstLink(){
    const links = document.querySelectorAll('.item__option');
    
    links[0].classList.add('item__active');
  }

  activeLink(){
    const links = document.querySelectorAll('.item__option');

    const opciones = ['perfil','direcciones','change-password'];
    const route = window.location.pathname.split('/').pop();


    if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
        const posc = opciones.indexOf(route!);
        links[posc].classList.add('item__active');
        if(route != opciones[0]){
          links[0].classList.remove('item__active');
        }
    } 

    links.forEach( l => l.addEventListener('click', () =>{
        links.forEach(j => j.classList.remove('item__active'));
        l.classList.add('item__active');
      }),
    );
  }

  goHome(){
    if(this.roleUser == 'Cliente'){
      this.roleUser = 'shop'
    }else{  
    }
    
    this._navigation.navigate([`/${this.roleUser.toLowerCase()}`]);
  }
}
