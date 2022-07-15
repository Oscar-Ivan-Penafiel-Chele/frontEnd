import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig, ConfirmationService, MessageService} from 'primeng/api'
import { Cart } from 'src/app/models/cart';
import { Order } from 'src/app/models/order';
import { Product } from 'src/app/models/product';
import { Promotion } from 'src/app/models/promotion';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { RestService } from 'src/app/services/rest.service';
import { TokenService } from 'src/app/services/token.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css'],
  providers: [ConfirmationService,MessageService]
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
  loadingDelete : boolean = false;
  loading : boolean = false;
  priceTotal : number = 0;
  order : Order = {} as Order;
  promotions : Promotion[] = [];
  
  constructor(
    private _primengConfig : PrimeNGConfig, 
    private _rest : RestService,
    private _token : TokenService, 
    private _authService : AuthService,
    private _navigate : Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { 
    this.overlayLogout = false;
    this.order.price_order_total = 0;
  }

  ngOnInit(): void {
    this._primengConfig.ripple = true;
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
    await this.getPromotions();
  }

  async isLog(){
    if(!this._token.getTokenDataUser()){
      return ;
    }

    this.user = JSON.parse(this._token.getTokenDataUser()!);
    this.isLogged = true;
  }
  
  async getAllProductsCart(id_user : number){
    this.loading = true;
    const data = {
      id_user : id_user
    };

    this._rest.getProductsCart(data).subscribe((response : Cart[])=>{
      response.forEach((i)=>{
        i.producto.product_price_aux = i.producto.product_price;
      })
      this.extractData(response);
    })
  }

  async extractData(data : Cart[]){
    this.products = data.map(({producto, product_offered, product_offered_price_total})=>{
      data.forEach((i)=>{
        i.producto.product_amount_sail = 1;
        if(product_offered != null && product_offered_price_total != null){
          producto.product_offered = product_offered;
          producto.product_price = product_offered_price_total;
        }
      })
      return producto;
    })
    
    this.products = this.products.sort(this.sortProduct);
    this.handleProduct(this.products);

    this.loading = false;
    this.loadingDelete = false;
    await this.getTotalPriceToPay();
    console.log(this.products)
  }

  handleProduct(products : Product[]){
    let x = 0;
    products.forEach((i : Product)=>{
      if(i.product_offered){ 
        i.productWithDiscount = (i.product_price_aux! - (i.product_price_aux! * (i.product_offered! / 100))).toFixed(2);
        i.product_price_amount =  i.productWithDiscount * i.product_amount_sail!;
      }else{
        i.product_price_amount =  i.product_price_aux! * i.product_amount_sail!;
      }

      i.product__price__iva = (i.product_price_amount! * 0.12).toFixed(2);
      i.product_price = parseFloat(i.product_price!.toString()) + parseFloat(i.product__price__iva)
    });

    
  }

  sortProduct(x : any ,y : any){
    if(x.product_name < y.product_name) return -1;
    if(x.product_name > y.product_name) return 1;
    return 0;
  }


  async getPromotions(){
    this._rest.getPromotions().subscribe((response : Promotion[])=>{
      
    });
  }

  getTotalPriceForUnit($event : any, product : Product){
    if(product.product_offered){ 
      product.productWithDiscount = (product.product_price_aux! - (product.product_price_aux! * (product.product_offered! / 100))).toFixed(2);
      product.product_price_amount =  product.productWithDiscount * product.product_amount_sail!;
    }else{
      product.product_price_amount =  product.product_price_aux! * product.product_amount_sail!;
    }

    product.product__price__iva = (product.product_price_amount! * 0.12).toFixed(2);
    product.product_price_total! = product.product_price! * $event.value;
    
    this.getTotalPriceForAmount();
  }

  async getTotalPriceToPay(){
    let totalIva = 0;
    let totalPrecioSinIva = 0;

    this.products.forEach((i)=>{
      if(i.product_price_total == undefined){

      i.product_amount_sail = 1;
      totalIva += parseFloat(i.product__price__iva); 
      totalPrecioSinIva += parseFloat(i.product_price!.toString());
      }
    })
    this.order.price_order_total = totalPrecioSinIva;
  }

  getTotalPriceForAmount(){
    let price : any ;

    const reduce = (i : number,j : number) => i+j;

    price = this.products.map((i)=>{
      if(i.product_price_total == undefined){
        
        i.product_price_total = parseFloat(i.product_price!.toString())
      } 

      return i.product_price_total;
    })

    this.order.price_order_total = price.reduce(reduce);
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

  next(){
    localStorage.setItem('producto',JSON.stringify(this.products));
    localStorage.setItem('total',this.order.price_order_total)
    this._navigate.navigate(['/checkout/order']);
  }

  async deleteProductCart(product : Product){
    this.loadingDelete = true;
    const data = {
      id_user : this.user.id_user,
      id_product : product.id_product
    }

    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el producto del carrito? `,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel : 'Si',
      acceptButtonStyleClass : '',
      rejectButtonStyleClass : ' p-button-text p-button-danger',
      accept: () => {
         this.requestDelete(data)
      },
    });
  }

  requestDelete(data : any){
    this._rest.deleteProductCart(data).subscribe((response)=>{
      if(response.status == 200 || response.message === "Eliminado con exito"){
        this.getAllProductsCart(this.user.id_user!);
        this.messageService.add({severity:'success', summary: 'Completado', detail: 'El producto fue eliminado'});
      }else if(response.status == 500 || response.message === "Ocurrio un error interno en el servidor"){
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Ocurrio un error interno en el servidor'});
        this.loadingDelete = false;
      }
    })
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event : any) {
      if(!this.getKeepSession()){
          localStorage.clear();
      }
  }

  getKeepSession(){
    const data = localStorage.getItem('keepSession');

    if(data!.toString() == "true"){
        return true;
    }else{
        return false;
    }
  }
}
