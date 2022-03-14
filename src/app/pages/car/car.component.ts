import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig} from 'primeng/api'
import { Cart } from 'src/app/models/cart';
import { Product } from 'src/app/models/product';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { HomeService } from 'src/app/services/home.service';
import { RestService } from 'src/app/services/rest.service';
import { TokenService } from 'src/app/services/token.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {

  fechaYHora : any ;
  user : User = {};
  isLogged?: boolean = false;
  overlayLogout : boolean;
  amount_product : number = 1;
  products : Product[] = [];
  host : string = environment.URL;
  overImage : string = "assets/img/not_image.jpg";
  
  constructor(
    private _primengConfig : PrimeNGConfig, 
    private _rest : RestService,
    private _token : TokenService, 
    private _authService : AuthService,
    private _navigate : Router,
    private _home : HomeService,
  ) { 
    this.overlayLogout = false;
  }

  ngOnInit(): void {
    this.getData();
  }

 
  goCart(){
    this._navigate.navigate(["/checkout/cart"]);
  }

  goHome(){
    this._navigate.navigate(["/shop"]);
  }

  async getData(){
    await this.isLog();
    await this.getAllProductsCart(this.user.id_user!);
  }

  async isLog(){
    if(!this._token.getTokenDataUser()){
      return ;
    }

    this.user = JSON.parse(this._token.getTokenDataUser()!);
    this.isLogged = true;
  }
  
  async getAllProductsCart(id_user : number){
    const data = {
      id_user : id_user
    };

    this._rest.getProductsCart(data).subscribe((response : Cart[])=>{
      this.extractData(response);
    })
  }

  extractData(data : Cart[]){
    this.products = data.map(({producto})=>{
      return producto;
    })
    
    console.log(this.products);
  }



  displayOptions(){
    const menu = document.querySelector('.nav__user');
    const menuOptions = document.querySelector('.nav__user__option');

    if(menuOptions?.classList.contains('isActiveNavOption')){
      menu?.classList.add('isActiveNavUser');
      menuOptions.classList.remove('isActiveNavOption');
    }else{
      menu?.classList.remove('isActiveNavUser');
      menuOptions?.classList.add('isActiveNavOption');
    }
  }

  isActive(){
    const hamburger =  document.querySelector('.hamburger');
    const menu = document.querySelector('.nav__menu');
    const content = document.querySelector('.content-main');

    hamburger?.classList.toggle('is-active');
    menu?.classList.toggle('display');
    
    // if(menu?.classList.contains("display")){
    //  content?.addEventListener('click',function(e){
    //      let isClickInside = menu.contains(e.target as Node);

    //      if(!isClickInside){
    //        console.log("Fuera");
    //        hamburger?.classList.remove("is-active"); 
    //        menu.classList.remove('display');  
    //      }
    //  })
    // }
  }

  getDateToday(){
    let hoy = new Date();

    let fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear();
    let hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();

    this.fechaYHora = fecha + ' ' + hora;

  }

  logOut(){
    this.overlayLogout = true;
    this._authService.logout(this.user.id_user!)
      .subscribe((response)=>{
        if(response.status == 200 || response.message === "Sesión cerrada con éxito"){
          this._token.removeToken();
          window.location.href = '/shop';
      }
    });
  }
}
