import { Component, OnInit } from '@angular/core';
import { Banner } from 'src/app/models/banner';
import { PrimeNGConfig ,ConfirmationService, MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment.prod';
import { RestService } from 'src/app/services/rest.service';
import { TokenService } from 'src/app/services/token.service';
import { User } from 'src/app/models/user';
import { Promotion } from 'src/app/models/promotion';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-promo',
  templateUrl: './promo.component.html',
  styleUrls: ['./promo.component.css'],
  providers : [MessageService,ConfirmationService]
})
export class PromoComponent implements OnInit {

  promotions : Promotion[] = [];
  promotionsAux : Promotion[] = [];

  products : Product[] = [];
  promotion : Promotion = {} as Promotion;

  user : User = {};
  loading : boolean = false;
  dialogBanner : boolean = false;
  actionSelected  : string ="";
  submitted: boolean = false;
  states : any[] = [];
  stateCheckActive : boolean = true;
  stateCheckInactive : boolean = false;
  disableButton : boolean = false;

  host : string = environment.URL;

  filteredProducts: any[] = [];
  selectedCountryAdvanced: Product = {} as Product;
  codeProducts : any = [];
  invalidDates: Array<Date> = [] ;
  isShowMessageDateInit : boolean = false;
  isShowMessageDateExpiry: boolean = false;
  messageErrorDateInit: string = "";
  messageErrorDateExpiry : string = "";

  constructor(
    private _rest : RestService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService, 
    private _token : TokenService,
    private config: PrimeNGConfig
  ) { 
    this.config.setTranslation({
      "clear" : "Vaciar",
      "today" : "Hoy",
      "dayNamesMin": ["D","L","M","X","J","V","S"],
      "monthNames": ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
    });
  }

  ngOnInit(): void {
    this.states = [
      {name: 'Activo', id: 1, icon : 'pi pi-thumbs-up'},
      {name: 'Inactivo', id: 0, icon : 'pi pi-thumbs-down'},
    ];
    this.getProducts();
    this.getPromotions();
    this.getDataProfile();

  }

  getProducts(){
    this._rest.getProducts().subscribe((response : Product[])=>{
      this.products = Object.values(response);
      this.products = this.products.filter((i) => i.product_status == 1 && !i.product_offered);
    })
  }

  getPromotions(){
    this.loading = true;
    this._rest.getPromotions().subscribe((response : Promotion[])=>{
      this.promotionsAux = Object.values(response);
      this.promotions = this.promotionsAux.filter((i)=> i.promotion_status == 1);
      this.loading = false;
    });
  }

  getDataProfile(){
    const data = this._token.getTokenDataUser() as string;
    this.user = JSON.parse(data);
  }

  openNew(){
    this.actionSelected = "new"
    this.promotion = {} as Promotion;
    this.submitted = false; 
    this.dialogBanner = true; 
    this.promotion.promotion_status = 1;  
  }

  hideDialog(){
    this.dialogBanner = false;
  }

  filterProduct(event : any) {
     let filtered : any[] = [];
     let query = event.query;

    for(let i = 0; i < this.products.length; i++) {
        let product = this.products[i];
        if (product.product_name!.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(product);
        }
    }

    this.filteredProducts = filtered;
  }

  change($event : any){
    if(this.stateCheckActive && this.stateCheckInactive){
         this.promotions = this.promotionsAux; 
    }

    if(!this.stateCheckActive && !this.stateCheckInactive) this.promotions = [] ;

    this.getPromotionsActives();
    this.getPromotionsInactives();
  }

  getPromotionsActives(){
    if(this.stateCheckActive && !this.stateCheckInactive){
        this.promotions = this.promotionsAux.filter( i => i.promotion_status == 1);
    }
  }

  getPromotionsInactives(){
      if(!this.stateCheckActive && this.stateCheckInactive){
          this.promotions = this.promotionsAux.filter( i => i.promotion_status == 0)
      }
  }

  getDateNow(){
    let dateNow = new Date();

    let day = (dateNow.getDate()) < 10 ? '0'+(dateNow.getDate()) : dateNow.getDate();;
    let month = (dateNow.getMonth() + 1) < 10 ? '0'+ (dateNow.getMonth() + 1) : dateNow.getMonth() + 1;
    let year = dateNow.getFullYear();
    let date = `${year}-${month}-${day}`;

    return date;
  }

  onSelectDateExpiry($event : any){
    const dateNow = this.getDateNow();
    this.handleDate($event , dateNow, false );
  }

  onSelectDateInit($event : any){
    const dateNow = this.getDateNow();
    this.handleDate($event , dateNow, true );
  }

  handleDate($event : any , dateNow : string , isDateInit : boolean){
    let date = new Date($event);
    let day= (date.getDate()) < 10 ? '0'+(date.getDate()) : date.getDate();
    let month = (date.getMonth() + 1) < 10 ? '0'+ (date.getMonth() + 1) : date.getMonth() + 1;
    let year = date.getFullYear();
    
    let dateSelected = `${year}-${month}-${day}`

    if(dateSelected < dateNow){
      if(isDateInit) this.isShowMessageDateInit = true;
      else this.isShowMessageDateExpiry = true;
      
      this.disableButton = true;
      return ; 
    }else{
      if(isDateInit) {this.isShowMessageDateInit = false; this.promotion.promotion_date_start = dateSelected;}
      else{ this.isShowMessageDateExpiry = false; this.promotion.promotion_date_of_expiry = dateSelected;}

      this.disableButton = false;
      
      this.validateDatesSelected();
    }
  }

  validateDatesSelected(){
    if(this.promotion.promotion_date_of_expiry < this.promotion.promotion_date_start) {
      this.messageErrorDateExpiry = "Fecha de expiración es menor a la fecha de inico" ; 
      this.isShowMessageDateExpiry = true ; 
      this.isShowMessageDateInit = false
      return ;
    }

    if(this.promotion.promotion_date_start > this.promotion.promotion_date_of_expiry) {
      this.messageErrorDateInit = "Fecha de inicio es mayor a la fecha de expiración" ; 
      this.isShowMessageDateInit = true ; 
      this.isShowMessageDateExpiry = false
      return ;
    }
  }

  savePromotion(){
    this.submitted = true

    if(!this.validateData()){
        return ;
    }

    if(this.actionSelected === "new"){
      this.validatePromotionProduct();

    }else if(this.actionSelected === "edit"){
      this.updateData();
    }
  }

  validatePromotionProduct(){ 
    const data = {
      id_product : this.promotion.id_product,
    }
    this._rest.validatePromotionProduct(data).subscribe((response)=>{
      if(response.status == 200 && response.message === "Tiene promocion"){
        this.messageService.add({severity:'error', summary: 'Error', detail: 'El producto seleccionado ya cuenta con una promoción', life:3000});
        return;
      }else if(response.status == 200 && response.message === "No tiene promocion"){
        this.saveData();
      }
    })
  }

  saveData(){
    this.promotion.id_user = this.user.id_user!;
        
    this._rest.createPromotion(this.promotion)
    .subscribe((response)=>{
      console.log(response)
        if(response.status == 200 && response.message === "Promocion creada con exito"){
            this.getPromotions()
            this.hideDialog();
            this.messageService.add({severity:'success', summary: 'Completado', detail: 'La promoción fue creada con éxito', life: 3000});
        }else if(response.status == 500 && response.message === "Ocurrio un error interno en el servidor"){
          this.hideDialog();
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Ocurrio un problema', life: 3000});
        }else if(response.status == 400){
          this.messageService.add({severity:'error', summary: 'Error', detail: `${response.message.promotion_date_start[0]}`, life: 3000});
        }
    });
  }

  validateData(){
    if(
      !this.promotion.id_product || 
      !this.promotion.promotion_description ||
      !this.promotion.promotion_discount || this.promotion.promotion_discount < 1 ||
      this.disableButton == true || 
      !this.promotion.promotion_date_start || this.isShowMessageDateInit ||
      !this.promotion.promotion_date_of_expiry || this.isShowMessageDateExpiry ||
      this.promotion.promotion_status == null){
        return false;
    }
  
    return true;
  }


  updateData(){
    this.promotion.id_user = this.user.id_user!;
    this._rest.updatePromotion(this.promotion)
    .subscribe((response)=>{
        if(response.status == 200 && response.message === "Promoción actualizada con exito"){
            this.getPromotions();
            this.hideDialog();
            this.messageService.add({severity:'success', summary: 'Completado', detail: 'La promoción fue actualizada con éxito', life:3000});
        }else if((response.status == 400 || response.status == 500) && response.message === "Ocurrio un error interno en el servidor"){
            this.hideDialog();
            this.messageService.add({severity:'error', summary: 'Error', detail: 'Ocurrio un error', life:3000});
        }
    });
  }

  editPromotion(promotion : Promotion){
    this.actionSelected = "edit"
    this.promotion = {...promotion};
    this.dialogBanner = true; 
    promotion.promotion_date_of_expiry = promotion.promotion_date_of_expiry.slice(0,10);
  }

  deletePromotion(promotion : Promotion){
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar la promoción del producto: ${promotion.producto.product_name}, código: ${promotion.producto.product_code}?`,
      header: 'Eliminar Promoción',
      acceptLabel : 'Eliminar',
      rejectLabel : 'Cancelar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this._rest.deletePromotion(promotion.id_promotion!, this.user.id_user!).subscribe((response)=>{
              if(response.status == 200 && response.message === "Eliminado correctamente"){
                  this.getPromotions();
                  this.messageService.add({severity:'success', summary: 'Completado', detail: 'Promoción Eliminado', life: 3000});
              }else{
                this.messageService.add({severity:'error', summary: 'Error', detail: 'Ocurrio un error', life: 3000});
              }
          },(err)=>{
            console.log(err.error);
          });
      }
  });
  }
}
