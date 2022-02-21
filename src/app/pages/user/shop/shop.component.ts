import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { PrimeNGConfig} from 'primeng/api';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  isLogged?: boolean = false;
  searchValue : string = "";
  user : User = {};
  isHidden?: boolean;
  fechaYHora : any ;
  overlayLogout : boolean = false;
  products : Product[] = [];
  responsiveOptions : any;
  images: any[] = [
    {name : 'assets/img/back.svg'},
    {name : 'assets/img/back.svg'},
  ];

  constructor(
    private _primengConfig : PrimeNGConfig, 
    private _token : TokenService, 
    private _routerNavigation : Router,
    private _authService : AuthService,
  ) { 
    this.responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 3,
          numScroll: 3
      },
      {
          breakpoint: '768px',
          numVisible: 2,
          numScroll: 2
      },
      {
          breakpoint: '560px',
          numVisible: 1,
          numScroll: 1
      }
  ];
  }

  ngOnInit(): void {
    this._primengConfig.ripple = true;
    this.isHidden= true;
    this.isLog();
    setInterval(()=>{
      this.getDateToday();
    },100); 
    this.products = [
      {
        id_product: 1, 
        id_user : 1, 
        id_provider : 1 , 
        id_brand : 1, 
        id_category : 1, 
        id_product_unit: 1,
        product_code:'123',
        product_name:'Roku Express | HD Streaming Media Player with High Speed HDMI Cable and Simple Remote',
        product_description:'Algo',
        product_stock: 12,
        product_price: 12,
        product_image:'Algo.jpg',
        product_status:1,
        product_rating:3,
      },
      {
        id_product: 1, 
        id_user : 1, 
        id_provider : 1 , 
        id_brand : 1, 
        id_category : 1, 
        id_product_unit: 1,
        product_code:'123',
        product_name:'Roku Express | HD Streaming Media Player with High Speed HDMI Cable and Simple Remote',
        product_description:'Algo',
        product_stock: 12,
        product_price: 12,
        product_image:'Algo.jpg',
        product_status:1,
        product_rating:3,
      },
      {
        id_product: 1, 
        id_user : 1, 
        id_provider : 1 , 
        id_brand : 1, 
        id_category : 1, 
        id_product_unit: 1,
        product_code:'123',
        product_name:'Roku Express | HD Streaming Media Player with High Speed HDMI Cable and Simple Remote',
        product_description:'Algo',
        product_stock: 12,
        product_price: 12,
        product_image:'Algo.jpg',
        product_status:1,
        product_rating:3,
      },
      {
        id_product: 1, 
        id_user : 1, 
        id_provider : 1 , 
        id_brand : 1, 
        id_category : 1, 
        id_product_unit: 1,
        product_code:'123',
        product_name:'Roku Express | HD Streaming Media Player with High Speed HDMI Cable and Simple Remote',
        product_description:'Algo',
        product_stock: 12,
        product_price: 12,
        product_image:'Algo.jpg',
        product_status:1,
        product_rating:3,
      },
      {
        id_product: 1, 
        id_user : 1, 
        id_provider : 1 , 
        id_brand : 1, 
        id_category : 1, 
        id_product_unit: 1,
        product_code:'123',
        product_name:'Roku Express | HD Streaming Media Player with High Speed HDMI Cable and Simple Remote',
        product_description:'Algo',
        product_stock: 12,
        product_price: 12,
        product_image:'Algo.jpg',
        product_status:1,
        product_rating:3,
      },
      {
        id_product: 1, 
        id_user : 1, 
        id_provider : 1 , 
        id_brand : 1, 
        id_category : 1, 
        id_product_unit: 1,
        product_code:'123',
        product_name:'Roku Express | HD Streaming Media Player with High Speed HDMI Cable and Simple Remote',
        product_description:'Algo',
        product_stock: 12,
        product_price: 12,
        product_image:'Algo.jpg',
        product_status:1,
        product_rating:3,
      },
      {
        id_product: 1, 
        id_user : 1, 
        id_provider : 1 , 
        id_brand : 1, 
        id_category : 1, 
        id_product_unit: 1,
        product_code:'123',
        product_name:'Roku Express | HD Streaming Media Player with High Speed HDMI Cable and Simple Remote',
        product_description:'Algo',
        product_stock: 12,
        product_price: 12,
        product_image:'Algo.jpg',
        product_status:1,
        product_rating:3,
      },
      {
        id_product: 1, 
        id_user : 1, 
        id_provider : 1 , 
        id_brand : 1, 
        id_category : 1, 
        id_product_unit: 1,
        product_code:'123',
        product_name:'Roku Express | HD Streaming Media Player with High Speed HDMI Cable and Simple Remote',
        product_description:'Algo',
        product_stock: 12,
        product_price: 12,
        product_image:'Algo.jpg',
        product_status:1,
        product_rating:3,
      },
      {
        id_product: 1, 
        id_user : 1, 
        id_provider : 1 , 
        id_brand : 1, 
        id_category : 1, 
        id_product_unit: 1,
        product_code:'123',
        product_name:'Roku Express | HD Streaming Media Player with High Speed HDMI Cable and Simple Remote',
        product_description:'Algo',
        product_stock: 12,
        product_price: 12,
        product_image:'Algo.jpg',
        product_status:1,
        product_rating:3,
      },
      {
        id_product: 1, 
        id_user : 1, 
        id_provider : 1 , 
        id_brand : 1, 
        id_category : 1, 
        id_product_unit: 1,
        product_code:'123',
        product_name:'Roku Express | HD Streaming Media Player with High Speed HDMI Cable and Simple Remote',
        product_description:'Algo',
        product_stock: 12,
        product_price: 12,
        product_image:'Algo.jpg',
        product_status:1,
        product_rating:3,
      },
      {
        id_product: 1, 
        id_user : 1, 
        id_provider : 1 , 
        id_brand : 1, 
        id_category : 1, 
        id_product_unit: 1,
        product_code:'123',
        product_name:'Roku Express | HD Streaming Media Player with High Speed HDMI Cable and Simple Remote',
        product_description:'Algo',
        product_stock: 12,
        product_price: 12,
        product_image:'Algo.jpg',
        product_status:1,
        product_rating:3,
      },
      {
        id_product: 1, 
        id_user : 1, 
        id_provider : 1 , 
        id_brand : 1, 
        id_category : 1, 
        id_product_unit: 1,
        product_code:'123',
        product_name:'Roku Express | HD Streaming Media Player with High Speed HDMI Cable and Simple Remote',
        product_description:'Algo',
        product_stock: 12,
        product_price: 12,
        product_image:'Algo.jpg',
        product_status:1,
        product_rating:3,
      },
    ];
  }

  isLog(){
    if(!this._token.getTokenDataUser()){
      return ;
    }

    this.user = JSON.parse(this._token.getTokenDataUser()!);
    this.isLogged = true;
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
          this.overlayLogout = false;
      }
    });
  }

  go(){
    window.location.href='shop';
  }
}
