import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig, MessageService} from 'primeng/api'
import { Cart } from 'src/app/models/cart';
import { Order } from 'src/app/models/order';
import { Product } from 'src/app/models/product';
import { Promotion } from 'src/app/models/promotion';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { HomeService } from 'src/app/services/home.service';
import { RestService } from 'src/app/services/rest.service';
import { TokenService } from 'src/app/services/token.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css'],
  providers: [MessageService]
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
    private messageService: MessageService
  ) { 
    this.overlayLogout = false;
    this.order.price_order_total = 0;
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
    console.log(this.products);
    this.loading = false;
    this.loadingDelete = false;
    await this.getTotalPriceToPay();
  }

  async getPromotions(){
    this._rest.getPromotions().subscribe((response : Promotion[])=>{
      
    });
  }

  getTotalPriceForUnit($event : any, product : Product){
    console.log(product);
    product.product_price_total! = product.product_price! * $event.value;
    this.getTotalPriceForAmount();
  }

  async getTotalPriceToPay(){
    this.products.forEach((i)=>{
      if(i.product_price_total == undefined){
        i.product_amount_sail = 1;
        this.order.price_order_total += parseFloat(i.product_price!.toString());
      }
    })
  }

  getTotalPriceForAmount(){
    let price : any ;
    const reduce = (i : number,j : number) => i+j;

    price = this.products.map((i)=>{
      if(i.product_price_total == undefined) i.product_price_total = parseFloat(i.product_price!.toString())
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
    localStorage.setItem('subtotal',JSON.stringify(this.order));
    localStorage.setItem('producto',JSON.stringify(this.products));
    this._navigate.navigate(['/checkout/order']);
  }

  async deleteProductCart(product : Product){
    this.loadingDelete = true;
    const data = {
      id_user : this.user.id_user,
      id_product : product.id_product
    }

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
}
