import { Component, HostListener, OnInit } from '@angular/core';
import { ConfirmationService, PrimeNGConfig, MessageService, SelectItem } from 'primeng/api';

import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/service/auth.service';
import { environment } from 'src/environments/environment.prod';
import { CartServiceService } from '../../cart/service/cart-service.service';
import { TokenService } from 'src/app/auth/service/token.service';
import { ProductService } from '../../admin/products/service/product.service';
import { PromotionService } from '../../admin/promotion/service/promotion.service';
import { BannerService } from '../../admin/banner/service/banner.service';
import { CategoryService } from '../../admin/category/service/category.service';
import { User, Product, Category, Banner, Promotion, Cart } from '@models/interfaces';

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
  promotions : Promotion[] = [];
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
  iconButton : string = "";
  arrayButtons : any = [];
  showPromotion : boolean = false;
  totalRecords: number= 0;
  
  sortOptions: SelectItem[] = [];
  sortOrder: number = 0;
  sortField: string = "";
  sortKey: string | undefined;

  images: any[] = [
    {name : 'assets/img/back.svg'},
    {name : 'assets/img/back.svg'},
  ];

  constructor(
    private _primengConfig : PrimeNGConfig, 
    private _token : TokenService, 
    private _authService : AuthService,
    private _navigate : Router,
    private messageService: MessageService, 
    private cartService : CartServiceService,
    private productService : ProductService,
    private promotionService : PromotionService,
    private bannerService : BannerService,
    private categoriesService : CategoryService,
  ) { 
    this.iconButton = "pi pi-shopping-cart"
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
    this.sortOptions = [
      {label: 'Precio alto a bajo', value: '!product_price'},
      {label: 'Price bajo a alto', value: 'product_price'}
    ];
  }

  ngOnInit(): void {
    this._primengConfig.ripple = true;
    this.isHidden= true;
    this.getKeepSession();
    this.isLog();
    this.getBanners();
    this.getData();
    this.getCategories();
    this.isActiveCategory();
  }

  async getData(){
    await this.getProducts();
    await this.getPromotions(); 
  }

  async getProducts(){
    this.productService.getProducts().subscribe((response : Product[]) =>{
      this.productAux = Object.values(response);
      this.products = this.productAux.filter(i=> i.product_status == 1 && i.product_stock! > 0 && i.product_price! > 0)
      this.products.sort(this.sortProducts)
      this.completeProduct = true;
    }, err=>{
      if(err.error == "abort") return;
      //this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un error en el servidor, intentalo más tarde', life: 3000});
    });
  }

  async getPromotions(){
    this.promotionService.getPromotions().subscribe((response : Promotion[])=>{
      this.promotions = Object.values(response);
      this.promotions = this.promotions.filter((i) => i.promotion_status == 1)
      this.products.forEach((product)=>{
        this.handlePromotions(product);
      })
    }, err=>{
      if(err.error == "abort") return;
      //this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un error en el servidor, intentalo más tarde', life: 3000});
    })
  }

  handlePromotions(product : Product){
    const dateNow = this.getDateNow();

    this.promotions.forEach((promotion)=>{
      if(promotion.promotion_date_start.slice(0,10) <= dateNow){
        if(promotion.promotion_date_of_expiry.slice(0,10) >= dateNow){
          this.showPromotion = true;
          if(product.id_product == promotion.id_product){
            product.product_offered = promotion.promotion_discount!;
            product.product_offered_price_total = parseFloat((product.product_price! - ((product.product_offered / 100) * product.product_price!))!.toFixed(2));
            return ;
          }
        }
      }

      return ;
    })
  }
  goCart(){
    this._navigate.navigate(["/checkout/cart"]);
  }

  isLog(){
    if(!this._token.getTokenDataUser()){
      return ;
    }

    this.user = this._token.getTokenDataUser()!;
    this.isLogged = true;
  }

  getBanners(){
    this.bannerComplete = true;
    this.bannerService.getBanners().subscribe((response)=>{
      this.banners = Object.values(response).filter((i)=> i.banner_status != 0);
      this.bannerComplete = false;
    }, err =>{
      if(err.error == "abort") return;
      //this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un error en el servidor, intentalo más tarde', life: 3000});
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

  getDateNow(){
    let dateNow = new Date();

    let day = (dateNow.getDate()) < 10 ? '0'+(dateNow.getDate()) : dateNow.getDate();;
    let month = (dateNow.getMonth() + 1) < 10 ? '0'+ (dateNow.getMonth() + 1) : dateNow.getMonth() + 1;
    let year = dateNow.getFullYear();
    let date = `${year}-${month}-${day}`;

    return date;
  }

  logOut(){
    this.overlayLogout = true;
    this._authService.logout(this.user.id_user!)
      .subscribe((response)=>{
        if(response.status == 200 || response.message === "Sesión cerrada con éxito"){
          this._token.removeToken();
          window.location.href = '/shop';
      }
    }, err =>{
      if(err.error == "abort") return;
      //this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un error en el servidor, intentalo más tarde', life: 3000});
    });
  }

  getCategories(){
    this.categoriesService.getCategories().subscribe((response : Category[])=>{
      this.categories = Object.values(response);
      this.categories = this.categories.sort(this.sortCategories);
      this.categories = this.categories.filter((i)=> i.category_status == 1 && i.category_name != 'NO DEFINIDO');
      this.hide = false;
    }, err =>{
      if(err.error == "abort") return;
      //this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un error en el servidor, intentalo más tarde', life: 3000});
    });
  }


  onSortChange(event : any) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
        this.sortOrder = -1;
        this.sortField = value.substring(1, value.length);
    }
    else {
        this.sortOrder = 1;
        this.sortField = value;
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
  
  isExistProduct($event : any, product : Product){
    const buttonSelected = $event.composedPath()[1].id;
    let spanClassList = $event.composedPath()[0].childNodes[1].classList;
    let buttonItem = $event.composedPath()[0];

    const data = {
      id_user : this.user.id_user
    };

    this.changeIconButton(spanClassList, buttonItem)

    this.cartService.getProductsCart(data).subscribe((response : Cart[])=>{
      let item = response.filter((i) => i.id_product == buttonSelected)

      if(item.length > 0){
        this.messageService.add({severity:'info', summary: 'Info', detail: 'El producto ya ha sido agregado', life: 3000});
        setTimeout(() => {
          spanClassList.replace('pi-clock','pi-shopping-cart');
          buttonItem.classList.remove('p-disabled');
        }, 1000);
        return ;
      }
      this.addItem(product, spanClassList, buttonItem);
    }, err =>{
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un error en el servidor, intentalo más tarde', life: 3000});
    })
  }

  addProductoCart($event : any , product : Product){
    if(!this.isAuthenticated()){
      this.showOverlayLogin = true;
      return ;
    }
    this.isExistProduct($event, product);
  }

  isAuthenticated(){
    return this._token.getToken();
  }

  async addItem(product : Product, spanClassList: any, buttonItem: any){
    const data = {
      id_user : this.user.id_user,
      id_product : product.id_product,
      product_offered : product.product_offered,
      product_offered_price_total : product.product_offered_price_total
    }

    this.cartService.addProductCart(data).subscribe((response) =>{
      if(response.status == 200 || response.message === "Guardado con exito"){
        this.messageService.add({severity:'success', summary: 'Completado', detail: 'Producto agregado al carrito', life:3000});
      }else if(response.status == 500 || response.message == "Ocurrio un error interno en el servidor"){
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Ocurrio un error', life: 3000});
      }

      spanClassList.replace('pi-clock','pi-shopping-cart');
      buttonItem.classList.remove('p-disabled');
    }, err =>{
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un error en el servidor, intentalo más tarde', life: 3000});
    });
  }

  async changeIconButton(spanClassList: any, buttonItem: any){
    try {
      if(spanClassList.contains('pi-shopping-cart')){
        buttonItem.classList.add('p-disabled');
        spanClassList.replace('pi-shopping-cart','pi-clock');
        return;
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
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

    if(data){
      if(data!.toString() == "true"){
        return true;
      }else{
          return false;
      }
    }
    return false;
  }
}
