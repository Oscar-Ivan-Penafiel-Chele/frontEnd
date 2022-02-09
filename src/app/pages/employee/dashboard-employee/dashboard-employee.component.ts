import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { User } from 'src/app/models/user';
import { AuthStateService } from 'src/app/services/auth-state.service';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-dashboard-employee',
  templateUrl: './dashboard-employee.component.html',
  styleUrls: ['./dashboard-employee.component.css']
})
export class DashboardEmployeeComponent implements OnInit {

  isHidden : boolean = true;
  i : number = 0;
  msgButton : string = "";
  fechaYHora : any ;
  user : User = {};
  isSignedIn?: boolean;
  roleUser : string = "";
 
  constructor(
    private primengConfig: PrimeNGConfig, 
    private _routerNavigation : Router,
    private _authService : AuthService,
    private _token : TokenService,
    private _authStateService : AuthStateService,
    ) { 
      
    }
    
    ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.activeFirstLink();
    this.activeLink();
    this.msgButton = "Desplegar";
    setInterval(()=>{
      this.getDateToday();
    },100); 
    
    this.getDataProfile();
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

    links.forEach( l => l.addEventListener('click', () =>{
        links.forEach(j => j.classList.remove('active'));
        l.classList.add('active');
      }),
    );
  }

  logOut(){
    const divLogout = document.getElementById('nav__aside__footer');
    divLogout!.style.pointerEvents = "none";
    this._authService.logout(parseInt(this.user.id_user as string))
      .subscribe((response)=>{
        if(response.status == 200 || response.message === "Sesión cerrada con éxito"){
          this._token.removeToken();
          this._routerNavigation.navigate(['login']);
      }
    });
  }

  getDateToday(){
    let hoy = new Date();

    let fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear();
    let hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();

    this.fechaYHora = fecha + ' ' + hora;

  }
}
