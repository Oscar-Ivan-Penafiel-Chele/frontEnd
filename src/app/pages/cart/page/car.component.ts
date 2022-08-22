import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig, ConfirmationService, MessageService} from 'primeng/api'
import { Cart, IManageIVA, Order, Product, Promotion, User } from '@models/interfaces';
import { AuthService } from 'src/app/auth/service/auth.service';

import { environment } from 'src/environments/environment.prod';
import { CartServiceService } from '../service/cart-service.service';
import { TokenService } from 'src/app/auth/service/token.service';
import { ManageIvaService } from '../../admin/manage-iva/service/manage-iva.service';

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
  loading : boolean = true;
  priceTotal : number = 0;
  order : Order = {} as Order;
  promotions : Promotion[] = [];
  manageIva : IManageIVA = {} as IManageIVA;
  emptyImage: string = "assets/img/image_empty.svg";
  isErrorStock = false;
  rowSelected: number | undefined ; 

  constructor(
    private _primengConfig : PrimeNGConfig, 
    private cartService : CartServiceService,
    private _token : TokenService, 
    private _authService : AuthService,
    private _navigate : Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private manageIvaService : ManageIvaService, 
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
    await this.getIva();
  }

  async isLog(){
    if(!this._token.getTokenDataUser()){
      return ;
    }

    this.user = this._token.getTokenDataUser()!;
    this.isLogged = true;
  }

  async getIva(){
    this.manageIvaService.getManageIva().subscribe((response : IManageIVA[]) =>{
      let data = response;
      this.manageIva = data.filter( i => i.iva_status === 1)[0];

      this.getAllProductsCart(this.user.id_user!);
    });
  }
  
  getAllProductsCart(id_user : number){
    this.loading = true;
    const data = {
      id_user : id_user
    };

    this.cartService.getProductsCart(data).subscribe((response : Cart[])=>{
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
    await this.getTotalPriceToPay();
  }

  handleProduct(products : Product[]){
    const dateNow = this.getDateToday();

    let x = 0;
    products.forEach((i : Product)=>{
      if(i.product_offered && i.product_offered != 0.00){ 
        i.productWithDiscount = (i.product_price_aux! - (i.product_price_aux! * (i.product_offered! / 100))).toFixed(2);
        i.product_price_amount =  i.productWithDiscount * i.product_amount_sail!;
      }else{
        i.product_price_amount =  i.product_price_aux! * i.product_amount_sail!;
      }

      if(i.product_iva == 0){
        i.product__price__iva = (i.product_price_amount! * 0).toFixed(2);
        i.product_price = parseFloat(i.product_price!.toString()) + parseFloat(i.product__price__iva)
        i.product_price = parseFloat(i.product_price!.toFixed(2).toString());

        return;
      }

      i.product__price__iva = (i.product_price_amount! * (this.manageIva.porcent / 100)).toFixed(2);
      i.product_price = parseFloat(i.product_price!.toString()) + parseFloat(i.product__price__iva)
      i.product_price = parseFloat(i.product_price!.toFixed(2).toString());
    });

  }

  sortProduct(x : any ,y : any){
    if(x.product_name < y.product_name) return -1;
    if(x.product_name > y.product_name) return 1;
    return 0;
  }

  getTotalPriceForUnit($event : any, product : Product, rowIndex: number){
    this.rowSelected = rowIndex;

    if($event.value > product.product_stock!){ 
      this.isErrorStock = true;
      return ; 
    }
    
    this.isErrorStock = false;
    
    if(product.product_offered){ 
      product.productWithDiscount = (product.product_price_aux! - (product.product_price_aux! * (product.product_offered! / 100))).toFixed(2);
      product.product_price_amount =  product.productWithDiscount * product.product_amount_sail!;
    }else{
      product.product_price_amount =  product.product_price_aux! * product.product_amount_sail!;
    }

    if(product.product_iva == 0){
      product.product__price__iva = (product.product_price_amount! * 0).toFixed(2);
      product.product_price_total! = (parseFloat(product.product_price_amount!) + parseFloat(product.product__price__iva)).toFixed(2);;

      this.getTotalPriceForAmount();
      return;
    }
    
    product.product__price__iva = (product.product_price_amount! * (this.manageIva.porcent / 100)).toFixed(2);
    product.product_price_total! = (parseFloat(product.product_price_amount!) + parseFloat(product.product__price__iva)).toFixed(2);
    
    this.getTotalPriceForAmount();
  }

  async getTotalPriceToPay(){
    let totalIva = 0;
    let totalPrecioSinIva = 0;

    this.products.forEach((i)=>{
      if(i.product_price_total == undefined){
        i.product_amount_sail = 1;
        totalIva += parseFloat(i.product__price__iva); 
        totalPrecioSinIva += i.product_price!;
        totalPrecioSinIva = parseFloat(totalPrecioSinIva.toFixed(2));
      }
    })
    this.order.price_order_total = totalPrecioSinIva;
  }

  getTotalPriceForAmount(){
    let price : any ;

    const reduce = (i : number,j : number) => i + j;

    price = this.products.map((i)=>{
      if(i.product_price_total == undefined){
        i.product_price_total = i.product_price;
      } 

      return parseFloat(i.product_price_total);
    })
    this.order.price_order_total = price.reduce(reduce);
    this.order.price_order_total = parseFloat(this.order.price_order_total).toFixed(2);
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

  }

  getDateToday(){
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
    });
  }

  next(){
    localStorage.setItem('producto',JSON.stringify(this.products));
    localStorage.setItem('total',this.order.price_order_total)
    localStorage.setItem('iva',JSON.stringify(this.manageIva.porcent));
    this._navigate.navigate(['/checkout/order']);
  }

  async deleteProductCart(product : Product){
    const data = {
      id_user : this.user.id_user,
      id_product : product.id_product
    }

    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el producto del carrito? `,
      header: 'Confirmación',
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
    this.cartService.deleteProductCart(data).subscribe((response)=>{
      if(response.status == 200 || response.message === "Eliminado con exito"){
        this.getAllProductsCart(this.user.id_user!);
        this.messageService.add({severity:'success', summary: 'Completado', detail: 'El producto fue eliminado'});
      }else if(response.status == 500 || response.message === "Ocurrio un error interno en el servidor"){
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Ocurrio un error interno en el servidor'});
      }
    })
  }

  cleanCart(){
    this.confirmationService.confirm({
      message: `¿Deseas eliminar todos los productos del carrito? `,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel : 'Si',
      acceptButtonStyleClass : '',
      rejectButtonStyleClass : ' p-button-text p-button-danger',
      accept: () => {
         this.deleteAllProducts()
      },
    });
  }

  deleteAllProducts(){
    this.loading = true;
    let data = {};
    const productLenght = this.products.length;

    this.products.forEach((product : Product, index)=>{
      data = {
        id_user : this.user.id_user,
        id_product : product.id_product
      };

      this.cartService.deleteProductCart(data).subscribe((response)=>{
        if(response.status >= 400 || response.message === "Ocurrio un error interno en el servidor"){
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Ocurrio un error interno en el servidor'});
          return;
        };

        if( index == (productLenght - 1)){
          this.getData();
          this.messageService.add({severity:'success', summary: 'Completado', detail: 'Todos los productos fueron eliminados del carrito!'});
        }
      })
    });
  }

  onBlurInput($event: any, product: Product): void{
    if(this.isErrorStock){
      this.isErrorStock = false;
  
      if(product.product_offered){ 
        product.productWithDiscount = (product.product_price_aux! - (product.product_price_aux! * (product.product_offered! / 100))).toFixed(2);
        product.product_price_amount =  product.productWithDiscount * product.product_amount_sail!;
      }else{
        product.product_price_amount =  product.product_price_aux! * product.product_amount_sail!;
      }
  
      if(product.product_iva == 0){
        product.product__price__iva = (product.product_price_amount! * 0).toFixed(2);
        product.product_price_total! = (parseFloat(product.product_price_amount!) + parseFloat(product.product__price__iva)).toFixed(2);;
  
        this.getTotalPriceForAmount();
        return;
      }
      
      product.product__price__iva = (product.product_price_amount! * (this.manageIva.porcent / 100)).toFixed(2);
      product.product_price_total! = (parseFloat(product.product_price_amount!) + parseFloat(product.product__price__iva)).toFixed(2);
      
      this.getTotalPriceForAmount();
      return;
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

    if(data!.toString() == "true"){
        return true;
    }else{
        return false;
    }
  }
}
