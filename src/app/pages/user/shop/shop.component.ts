import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { } from 'primeng/api';
import { ConfirmationService, PrimeNGConfig, MessageService } from 'primeng/api';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Product } from 'src/app/models/product';
import { Category } from 'src/app/models/category';
import { RestService } from 'src/app/services/rest.service';
import { environment } from 'src/environments/environment.prod';
import { HomeService } from 'src/app/services/home.service';
import { Banner } from 'src/app/models/banner';
import { Promotion } from 'src/app/models/promotion';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
  providers : [MessageService,ConfirmationService]
})
export class ShopComponent implements OnInit {

  products : Product[] = [];
  productAux : Product[] = [];
  
  categories : Category[] = [];
  
  searchValue : string = "";
  isHidden?: boolean;
  hide : boolean = true;
  overlayLogout : boolean;
  responsiveOptions : any;
  sortOptions: any;
  sortOrder: number = 0;
  promotions : Promotion[] = [];
  sortField: string = "";
  banners : Banner[] = [];
  host : string = environment.URL;
  overImage : string = "assets/img/not_image.jpg";
  completeProduct : boolean = false;
  fechaYHora : any ;
  user : User = {};
  isLogged?: boolean = false; //
  loadingShop : boolean = false;
  checked: boolean = true;
  i : number = 0;
  bannerComplete : boolean = false;
  showOverlayLogin : boolean = false;

  images: any[] = [
    {name : 'assets/img/back.svg'},
    {name : 'assets/img/back.svg'},
  ];

  constructor(
    private _primengConfig : PrimeNGConfig, 
    private _rest : RestService,
    private _token : TokenService, 
    private _authService : AuthService,
    private _navigate : Router,
    private _home : HomeService,
    private messageService: MessageService, 
  ) { 
    this.overlayLogout = false;
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
    this.isLog();
    this.getBanners();
    setInterval(()=>{
      this.getDateToday();
    },100); 
    this.getData();
    this.sortOptions = [
      {label: 'De mayor a menor', value: 'menor'},
      {label: 'De menor a mayor', value: 'mayor'}
  ];
    this._primengConfig.ripple = true;
    this.isHidden= true;
    this.getCategories();
    setTimeout(()=>{
      this.isActiveCategory();
    },3000)
  }

  async getData(){
    await this.getProducts();
    await this.getPromotions();
  }

  goCart(){
    this._navigate.navigate(["/checkout/cart"]);
  }

  isLog(){
    if(!this._token.getTokenDataUser()){
      return ;
    }

    this.user = JSON.parse(this._token.getTokenDataUser()!);
    this.isLogged = true;
  }

  getBanners(){
    this.bannerComplete = true;
    this._rest.getBanners().subscribe((response)=>{
      this.banners = Object.values(response).filter((i)=> i.banner_status != 0);
      this.bannerComplete = false;
    });
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

  getCategories(){
    this._rest.getCategories().subscribe((response : Category[])=>{
      this.categories = Object.values(response);
      this.categories = this.categories.sort(this.sortCategories);
      this.categories = this.categories.filter((i)=> i.category_status == 1 && i.category_name != 'NO DEFINIDO');
      this.hide = false;
    });
  }

  async getProducts(){
    this._rest.getProducts().subscribe((response : Product[]) =>{
      this.productAux = Object.values(response);
      this.products = this.productAux.filter(i=> i.product_status == 1)
      this.products.sort(this.sortProducts)
      this.completeProduct = true;
      this.changeButtonCart();
    });
  }

  async getPromotions(){
    this._rest.getPromotions().subscribe((response : Promotion[])=>{
      this.promotions = Object.values(response);

      this.products.forEach((product)=>{
        this.promotions.forEach((promotion)=>{
          if(product.id_product == promotion.id_product){
            product.product_offered = parseInt((promotion.promotion_discount)!.toString().split('.')[0]);
            product.product_offered_price_total = product.product_price! - ((product.product_offered / 100) * product.product_price!);
          }
        })
      })
      
    })
  }

  onSortChange(event : any) {
    if(event.value == "mayor"){
      this.products = this.products.sort(this.sortProductForPriceHight);
    }else if(event.value == "menor"){
      this.products = this.products.sort(this.sortProductForPriceLow);
    }
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

  addProductoCart($event : any , product : Product){
    if(!this.isAuthenticated()){
      this.showOverlayLogin = true;
      return ;
    }

    this.addItem(product);
  }

  isAuthenticated(){
    return this._token.getToken();
  }

  addItem(product : Product){
    const data = {
      id_user : this.user.id_user,
      id_product : product.id_product,
      product_offered : product.product_offered,
      product_offered_price_total : product.product_offered_price_total
    }

    this._rest.addProductCart(data).subscribe((response) =>{
      if(response.status == 200 || response.message === "Guardado con exito"){
        this.messageService.add({severity:'success', summary: 'Completado', detail: 'Producto agregado al carrito', life: 3000});
      }else if(response.status == 500 || response.message == "Ocurrio un error interno en el servidor"){
        this.messageService.add({severity:'error', summary: 'Completado', detail: 'Ocurrio un error', life: 3000});
      }
    });
  }

  changeButtonCart(){
    const buttons = document.querySelectorAll('.button__cart');
    
    console.log(buttons);
    // buttons.forEach( l => l.addEventListener('click', () =>{
    //   console.log(l);
    // }));
  }

}
