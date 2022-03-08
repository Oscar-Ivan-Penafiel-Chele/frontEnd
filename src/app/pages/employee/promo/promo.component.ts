import { Component, OnInit } from '@angular/core';
import { Banner } from 'src/app/models/banner';
import { ConfirmationService, MessageService } from 'primeng/api';
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

  banners : Banner[] = [];
  bannersAux : Banner[] = [];

  banner : Banner = {};
  user : User = {};
  loading : boolean = false;
  dialogBanner : boolean = false;
  actionSelected  : string ="";
  submitted: boolean = false;
  states : any[] = [];
  photoSelected? : string | ArrayBuffer | null;
  inputFile :boolean = false;
  isPhoto : boolean = false;
  isPhotoEdit : boolean;
  isError : boolean ;
  overImage : string = "assets/img/not_image.jpg";
  fileExtensionValid : boolean = false;
  sizeFileValid : boolean = false;
  fileTmp : any;
  fileSize : string = "";
  descriptionSize : string = "";
  stateCheckActive : boolean = true;
  stateCheckInactive : boolean = false;

  host : string = environment.URL;

  filteredProducts: any[] = [];
  selectedCountryAdvanced: Product = {} as Product;
  codeProducts : any = [];

  constructor(
    private _rest : RestService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService, 
    private _token : TokenService
  ) { 
    this.isPhotoEdit = false;
    this.isError = false;
  }

  ngOnInit(): void {
    this.states = [
      {name: 'Activo', id: 1, icon : 'pi pi-thumbs-up'},
      {name: 'Inactivo', id: 0, icon : 'pi pi-thumbs-down'},
    ];
    this.getProducts();
    this.getBanners();
    this.getDataProfile();
  }

  getProducts(){
    this._rest.getProducts().subscribe((response : Product[])=>{
      this.products = Object.values(response);
      this.products = this.products.filter((i) => i.product_status == 1);
    })
  }

  getBanners(){
    this._rest.getBanners().subscribe((response : Banner[])=>{
      this.bannersAux = Object.values(response);

      this.banners = this.bannersAux.filter((r)=> r.banner_status == 1);
    }); 
  }

  getDataProfile(){
    const data = this._token.getTokenDataUser() as string;
    this.user = JSON.parse(data);
  }

  openNew(){
    this.actionSelected = "new"
    this.isPhoto = false;
    this.inputFile = false; 
    this.banner = {};
    this.fileTmp = {}; 
    this.submitted = false; 
    this.dialogBanner = true; 
    this.isPhotoEdit = false; 
    this.banner.banner_status = 1;  
  }

  hideDialog(){
    this.dialogBanner = false;
  }

  filterProduct(event : any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
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
         this.banners = this.bannersAux; 
    }

    if(!this.stateCheckActive && !this.stateCheckInactive) this.banners = [] ;

    this.getBannersActives();
    this.getBannersInactives();
  }

  getBannersActives(){
    if(this.stateCheckActive && !this.stateCheckInactive){
        this.banners = this.bannersAux.filter( i => i.banner_status == 1);
    }
  }

  getBannersInactives(){
      if(!this.stateCheckActive && this.stateCheckInactive){
          this.banners = this.bannersAux.filter( i => i.banner_status == 0)
      }
  }

  onSelect(value : any){
    // this.promotion.promotion_product.product_name = value.product_name;
  }

  saveBanner(){
    console.log(this.selectedCountryAdvanced.product_name);
    // if(this.actionSelected === "new"){
    //   this.submitted = true

    //   if(!this.validateData()){
    //       return ;
    //   }
      
    //   this.saveData();

    // }else if(this.actionSelected === "edit"){
    //   if(this.isObjEmpty(this.fileTmp)){
    //       //Se envia la misma imagen 
    //       this.fileTmp = {};
    //       if(!this.validateDataNoImage()){
    //           return ;
    //       }
    //       if(!this.banner.banner_thumbnail){
    //           this.submitted = true
    //       }

    //       this.updateData(false);
    //   }else{
    //       //Se cambia la imagen
    //       this.submitted = true
    //       if(!this.validateData()){
    //           return ;
    //       }
    //       this.updateData(true);
    //   }
    // }
  }

  saveData(){
    const data = new FormData();
    data.append('image', this.fileTmp.fileRaw);
    Object.entries(this.banner).forEach(([key , value]) => {
        data.append(`${key}`, value);
    });
    data.append('id_user',String(this.user.id_user));
        
    this._rest.createBanner(data)
        .subscribe((response)=>{
            if(response.status == 200 && response.message === "Banner creado con exito"){
                this.getBanners()
                this.hideDialog();
                this.messageService.add({severity:'success', summary: 'Completado', detail: 'El banner fue creado con éxito', life: 3000});
            }else{
              this.hideDialog();
              this.messageService.add({severity:'error', summary: 'Error', detail: 'Ocurrio un problema', life: 3000});
            }
        });
  }

  validateData(){
    if(this.isObjEmpty(this.fileTmp) || !this.banner.banner_name || this.banner.banner_status == null){
        return false;
    }
  
    return true;
  }

  validateDataNoImage(){
    if(!this.banner.banner_name || this.banner.banner_status == null){
        return false;
    }
  
    return true;
  }

  isObjEmpty(obj : any) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) return false;
    }
    return true;
  }

  updateData(existImage : boolean){

    const data = new FormData();

    if(existImage){
        data.append('image', this.fileTmp.fileRaw);
    }

    Object.entries(this.banner).forEach(([key , value]) => {
        data.append(`${key}`, value);
    });
    data.append('id_user',String(this.user.id_user));

    this._rest.updateBanner(data, this.banner.id_banner!)
    .subscribe((response)=>{
        if(response.status == 200 && response.message === "Banner actualizada con exito"){
            this.getBanners();
            this.hideDialog();
            this.messageService.add({severity:'success', summary: 'Completado', detail: 'El banner fue actualizado con éxito', life:3000});
        }else if((response.status == 400 || response.status == 500) && response.message === "Ocurrio un error interno en el servidor"){
            this.hideDialog();
            this.messageService.add({severity:'error', summary: 'Error', detail: 'Ocurrio un error', life:3000});
        }
    });
  }

  editBanner(banner : Banner){
    this.actionSelected = "edit"
    this.banner = {...banner};
    this.isPhoto = true;   // Le decimos que si hay foto
    this.inputFile = true; // LE decimos que bloquee el inputFile
    this.isPhotoEdit = true; // Le decimos que si hay foto para editar
    this.dialogBanner = true; // abrimos modal
    this.fileTmp = {}; 
  }

  deleteBanner(banner : Banner){
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar el banner: ' + banner.banner_name + '?',
      header: 'Eliminar Banner',
      acceptLabel : 'Eliminar',
      rejectLabel : 'Cancelar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this._rest.deleteBrand(banner.id_banner!, this.user.id_user!).subscribe((response)=>{
              if(response.status == 200 && response.message === "Eliminado correctamente"){
                  this.getBanners()
                  this.messageService.add({severity:'success', summary: 'Completado', detail: 'Banner Eliminado', life: 3000});
              }else{
                this.messageService.add({severity:'error', summary: 'Error', detail: 'Ocurrio un error', life: 3000});
              }
          },(err)=>{
            console.log(err.error);
          });
      }
  });
  }


  clearImage(){
    this.isPhoto = false;
    this.inputFile = false;
    this.fileTmp = {};
    this.photoSelected = "";
    this.isPhotoEdit = false;
    this.banner.banner_image = '';
  }

}
