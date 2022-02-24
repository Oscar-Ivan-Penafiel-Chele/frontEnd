import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { PrimeNGConfig} from 'primeng/api';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Product } from 'src/app/models/product';
import { Category } from 'src/app/models/category';
import { RestService } from 'src/app/services/rest.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  user : User = {};
  
  products : Product[] = [];
  productAux : Product[] = [];
  
  categories : Category[] = [];
  
  isLogged?: boolean = false;
  searchValue : string = "";
  isHidden?: boolean;
  hide : boolean = true;
  fechaYHora : any ;
  overlayLogout : boolean = false;
  responsiveOptions : any;
  sortOptions: any;
  sortOrder: number = 0;
  sortField: string = "";
  host : string = environment.URL;
  overImage : string = "assets/img/not_image.jpg";
  completeProduct : boolean = false;


  images: any[] = [
    {name : 'assets/img/back.svg'},
    {name : 'assets/img/back.svg'},
  ];

  constructor(
    private _primengConfig : PrimeNGConfig, 
    private _token : TokenService, 
    private _routerNavigation : Router,
    private _authService : AuthService,
    private _rest : RestService,
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
    this.getProducts();
    this.sortOptions = [
      {label: 'De mayor a menor', value: 'menor'},
      {label: 'De menor a mayor', value: 'mayor'}
  ];
    this._primengConfig.ripple = true;
    this.isHidden= true;
    this.isLog();
    setInterval(()=>{
      this.getDateToday();
    },100); 
    this.getCategories();
    setTimeout(()=>{
      this.isActiveCategory();
    },3000)
  }

  getCategories(){
    this._rest.getCategories().subscribe((response : Category[])=>{
      this.categories = Object.values(response);
      this.categories = this.categories.sort(this.sortCategories);
      this.categories = this.categories.filter((i)=> i.category_status == 1);
      this.hide = false;
    });
  }

  getProducts(){
    this._rest.getProducts().subscribe((response : Product[]) =>{
      this.productAux = Object.values(response);
      this.products = this.productAux.filter(i=> i.product_status == 1)
      this.products.sort(this.sortProducts)
      this.completeProduct = true;
    });
  }

  isLog(){
    if(!this._token.getTokenDataUser()){
      return ;
    }

    this.user = JSON.parse(this._token.getTokenDataUser()!);
    this.isLogged = true;
  }

  onSortChange(event : any) {
    if(event.value == "mayor"){
      this.products = this.products.sort(this.sortProductForPriceHight);
    }else if(event.value == "menor"){
      this.products = this.products.sort(this.sortProductForPriceLow);
    }
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

  isActiveCategory(){
    const opc = document.querySelectorAll('.chip__item');
    
    opc.forEach( i => i.addEventListener('click',()=>{
        opc.forEach(j => j.classList.remove('chip__item__active'));
        i.classList.add('chip__item__active');
        if(i.id == '0'){
          this.products = this.productAux.filter(i=>i.product_status == 1);
          this.products.sort(this.sortProducts);
        }else{
          this.products = this.productAux.filter(l=> l.id_category == i.id);
        }
      })
    );
  }

  sortProducts(x : any ,y : any){
    if(x.product_name < y.product_name) return -1;
    if(x.product_name > y.product_name) return 1;
    return 0;
  }

  sortCategories(x : any ,y : any){
    if(x.category_name < y.category_name) return -1;
    if(x.category_name > y.category_name) return 1;
    return 0;
  }

  sortProductForPriceHight(x : any,y : any){
    if(x.product_price < y.product_price) return -1;
    if(x.product_price > y.product_price) return 1;
    return 0;
  }

  sortProductForPriceLow(x : any,y : any){
    if(x.product_price > y.product_price) return -1;
    if(x.product_price < y.product_price) return 1;
    return 0;
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
