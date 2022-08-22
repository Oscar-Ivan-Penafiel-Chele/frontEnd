import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { User } from '@models/interfaces';
import { AuthService } from 'src/app/auth/service/auth.service';
import { TokenService } from 'src/app/auth/service/token.service';


@Component({
  selector: 'app-salesman',
  templateUrl: './salesman.component.html',
  styleUrls: ['./salesman.component.css']
})
export class SalesmanComponent implements OnInit {

  isHidden : boolean = true;
  i : number = 0;
  msgButton : string = "";
  fechaYHora : any ;
  user : User = {};
  roleUser : string = "";
  overlayLogout : boolean = false;
  
  constructor(
    private primengConfig: PrimeNGConfig, 
    private _routerNavigation : Router, 
    private _token : TokenService,
    private _authService : AuthService,
  ) { }

  ngOnInit(): void {
    this.getDataProfile();
    this.primengConfig.ripple = true;
    this.activeFirstLink();
    this.activeLink();
    this.msgButton = "Desplegar";
    setInterval(()=>{
      this.getDateToday();
    },100); 
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


  showNavbar (){
    const nav = document.querySelector('.nav__aside');
    const icon = document.querySelector('.icon-toggle');

    if(icon?.classList[1] == 'pi-bars'){
      icon?.classList.replace('pi-bars','pi-times');
      nav?.classList.remove('hide');
      nav?.classList.add('show');
      this.msgButton = "Encoger";
      setTimeout(() => {
        this.isHidden = false;
      }, 200);
    }else{
      this.isHidden = true;
      nav?.classList.remove('show');
      nav?.classList.add('hide');
      icon?.classList.replace('pi-times','pi-bars');
      this.msgButton = "Desplegar";
    }
  }

  activeFirstLink(){
    const links = document.querySelectorAll('.nav__aside__item');
    
    links[0].classList.add('active');
  }

  activeLink(){
    const links = document.querySelectorAll('.nav__aside__item');

    const opciones = ['pedidos'];
    const route = window.location.pathname.split('/').pop();


    if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
        const posc = opciones.indexOf(route!);
        links[posc].classList.add('active');
        if(route != opciones[0]){
          links[0].classList.remove('active');
        }
    } 

    links.forEach( l => l.addEventListener('click', () =>{
        links.forEach(j => j.classList.remove('active'));
        l.classList.add('active');
      }),
    );
  }

  logOut(){
    this.overlayLogout = true;
    this._authService.logout(this.user.id_user!).subscribe((response)=>{
      if(response.status == 200 || response.message == "Sesión cerrada con éxito"){
        this._token.removeToken();
        this._routerNavigation.navigate(['login']);
      }
    });
  }

  getDateToday(){
    let hoy = new Date();

    let fecha = hoy.getFullYear() + '-' + ( (hoy.getMonth() + 1) < 10 ? '0'+(hoy.getMonth() + 1) : (hoy.getMonth() + 1)) + '-' + (hoy.getDate() < 10 ? '0'+hoy.getDate() : hoy.getDate());
    let hora = (hoy.getHours() < 10 ? '0'+hoy.getHours() : hoy.getHours()) + ':' + (hoy.getMinutes() < 10 ? '0'+hoy.getMinutes() : hoy.getMinutes()) + ':' + (hoy.getSeconds() < 10 ? '0'+hoy.getSeconds() : hoy.getSeconds());

    this.fechaYHora = fecha + ' ' + hora;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event : any) {
      if(!this.getKeepSession()){
          localStorage.clear();
      }
  }

  getKeepSession(){
    if(!localStorage.getItem('keepSession')) return false;
    
    const data = localStorage.getItem('keepSession');

    if(data!.toString() == "true"){
        return true;
    }else{
        return false;
    }
  }
}
