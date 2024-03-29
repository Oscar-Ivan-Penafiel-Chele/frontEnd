import { UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TokenService } from 'src/app/auth/service/token.service';
import { Brand, User } from '@models/interfaces';
import { environment } from 'src/environments/environment.prod';
import { BrandService } from '../service/brand.service';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css'],
  providers : [MessageService,ConfirmationService, UpperCasePipe]
})
export class BrandComponent implements OnInit {

  brands : Brand[] = [];

  brand : Brand = {};
  user : User = {};

  photoSelected? : string | ArrayBuffer | null;
  productDialog: boolean = false;
  actionSelected  : string ="";
  inputFile :boolean = false;
  isPhoto : boolean = false;
  loading : boolean = false;
  isPhotoEdit : boolean;
  isError : boolean ;
  submitted: boolean = false;
  fileExtensionValid : boolean = false;
  sizeFileValid : boolean = false;
  fileTmp : any;
  fileSize : string = "";
  descriptionSize : string = "";
  states : any[] = [];
  i : number = 0;
  overImage : string = "assets/img/not_image.jpg";
  stateCheckActive : boolean = true;
  stateCheckInactive : boolean = false;
  brandsAux : Brand[] = [];

  host : string = environment.URL;

  constructor(
    private brandService : BrandService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
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

    this.getBrands();
    this.getDataProfile();
    this.fileTmp = {};
  }

  getDataProfile(){
    const data = this._token.getTokenDataUser();
    this.user = data;
  }

  getBrands(){
    this.loading = true;
    this.brandService.getBrands()
    .subscribe((response : Brand[]) => {
      this.brandsAux = Object.values(response);
        if(this.stateCheckActive && !this.stateCheckInactive){
          this.brands = this.brandsAux.filter(i => i.brand_status == 1 && i.brand_name != 'NO_DEFINIDO');
        }else if(!this.stateCheckActive && this.stateCheckInactive){
          this.brands = this.brandsAux.filter(i => i.brand_status == 0 && i.brand_name != 'NO_DEFINIDO');
        }else if(this.stateCheckActive && this.stateCheckInactive){
          this.brands = this.brandsAux.filter(i => i.brand_name != 'NO_DEFINIDO');
        }
        this.loading = false;
    }, err =>{
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un problema en el servidor', life: 3000});
    })
  }

  getPhotoSelected($event : any){
    if($event.target.files && $event.target.files[0]){
      const [ file ] = $event.target.files;
      this.fileTmp = {
          fileRaw : file,
          fileName : file.name,
          fileSize : file.size,
      }

      if(!this.validateSizeImage(this.fileTmp.fileSize)){
          return;
      }

      if(!this.validateImageExtension(this.fileTmp.fileName)){
          return;
      }

      this.getSizeImage(this.fileTmp.fileSize);

      const reader = new FileReader;
      reader.onload = e => this.photoSelected = reader.result;
      reader.readAsDataURL(this.fileTmp.fileRaw);
      this.isPhoto = true;
      this.inputFile = true;
      this.brand.brand_thumbnail = this.fileTmp.fileName;
    }
  }

  change($event : any){
    if(this.stateCheckActive && this.stateCheckInactive){
         this.brands = this.brandsAux;
    }

    if(!this.stateCheckActive && !this.stateCheckInactive) this.brands = [] ;

    this.getBrandsActives();
    this.getBrandsInactives();
  }

  getBrandsActives(){
    if(this.stateCheckActive && !this.stateCheckInactive){
        this.brands = this.brandsAux.filter( i => i.brand_status == 1);
    }
  }

  getBrandsInactives(){
      if(!this.stateCheckActive && this.stateCheckInactive){
          this.brands = this.brandsAux.filter( i => i.brand_status == 0)
      }
  }

  validateSizeImage(size : number) : boolean{
    if(size > 1000000){
        this.sizeFileValid = true;
        this.fileTmp = {};
        return false;
    }else{
        this.sizeFileValid = false;
        return true;
    }
  }

  validateImageExtension(nameImage : string) : boolean{
      let imageExtension = nameImage.split('.').pop();
      const ext = ['jpg','png','jpeg'];

      if(!ext.includes(imageExtension!)){
          this.fileExtensionValid = true;
          this.fileTmp = {};
          return false;
      }else{
          this.fileExtensionValid = false;
          return true;
      }
  }

  getSizeImage(size : number) : void{
    if(size < 1048576){
        this.fileSize = (size/1000).toFixed(0);
        this.descriptionSize = "kb";
    }else if(size >= 1048576){
        this.fileSize = (size/1000000).toFixed(0);
        this.descriptionSize = "mb";
    }
  }

  openNew() {
    this.actionSelected = "new"
    this.isPhoto = false;  // Le decimos que no hay foto
    this.inputFile = false; // Le decimos que habilite el inputFile
    this.brand = {}; // seteamos la categoria
    this.fileTmp = {};  // seteamos el archivo de las imagenes
    this.submitted = false; // le decimos que no valide ningun campo
    this.productDialog = true; // abrimos el modal
    this.isPhotoEdit = false; // LE decimos que no es una imagen a editar
    this.brand.brand_status = 1;  // asignamos el status por defecto a : Activo
}
  clearImage(){
    this.isPhoto = false;
    this.inputFile = false;
    this.fileTmp = {};
    this.photoSelected = "";
    this.isPhotoEdit = false;
    this.brand.brand_thumbnail = '';
  }

  saveProduct(){
    if(this.actionSelected === "new"){
      this.submitted = true

      if(!this.validateData()){
          return ;
      }

      this.saveData();

    }else if(this.actionSelected === "edit"){
      if(this.isObjEmpty(this.fileTmp)){
          //Se envia la misma imagen
          this.fileTmp = {};
          if(!this.validateDataNoImage()){
              return ;
          }
          if(!this.brand.brand_thumbnail){
              this.submitted = true
          }

          this.updateData(false);
      }else{
          //Se cambia la imagen
          this.submitted = true
          if(!this.validateData()){
              return ;
          }
          this.updateData(true);
      }
    }
  }

  saveData(){
    const data = new FormData();
    data.append('image', this.fileTmp.fileRaw);
    Object.entries(this.brand).forEach(([key , value]) => {
        data.append(`${key}`, value);
    });
    data.append('id_user',String(this.user.id_user));

    this.brandService.createBrand(data)
        .subscribe((response)=>{
            if(response.status == 200 && response.message === "Marca creada con exito"){
                this.getBrands();
                this.hideDialog();
                this.messageService.add({severity:'success', summary: 'Completado', detail: 'La marca fue creado con éxito', life: 3000});
            }else{
              this.hideDialog();
              this.messageService.add({severity:'error', summary: 'Error', detail: 'Ocurrio un problema', life: 3000});
            }
        }, err =>{
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un problema en el servidor', life: 3000});
        });
  }

  validateData(){
    if(this.isObjEmpty(this.fileTmp) || !this.brand.brand_name || this.brand.brand_status == null){
        return false;
    }

    return true;
  }

  validateDataNoImage(){
      if(!this.brand.brand_name || this.brand.brand_status == null){
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

    Object.entries(this.brand).forEach(([key , value]) => {
        data.append(`${key}`, value);
    });
    data.append('id_user',String(this.user.id_user));

    this.brandService.updateBrand(data, this.brand.id_brand!)
    .subscribe((response)=>{
        if(response.status == 200 && response.message === "Marca actualizada con exito"){
            this.getBrands();
            this.hideDialog();
            this.messageService.add({severity:'success', summary: 'Completado', detail: 'La marca fue actualizado con éxito', life:3000});
        }else if((response.status == 400 || response.status == 500) && response.message === "Ocurrio un error interno en el servidor"){
            this.hideDialog();
            this.messageService.add({severity:'error', summary: 'Error', detail: 'Ocurrio un error', life:3000});
        }
    }, err =>{
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un problema en el servidor', life: 3000});
    });
  }

  exportPdf() {}

  editBrand(brand : Brand){
    this.actionSelected = "edit"
    this.brand = {...brand};
    this.isPhoto = true;   // Le decimos que si hay foto
    this.inputFile = true; // LE decimos que bloquee el inputFile
    this.isPhotoEdit = true; // Le decimos que si hay foto para editar
    this.productDialog = true; // abrimos modal
    this.fileTmp = {};
  }

  deleteBrand(brand: Brand) {
    this.confirmationService.confirm({
        message: '¿Estás seguro de eliminar la marca: ' + brand.brand_name + '?',
        header: 'Eliminar Marca',
        acceptLabel : 'Eliminar',
        rejectLabel : 'Cancelar',
        rejectButtonStyleClass: 'p-button-outlined p-button-danger',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.brandService.deleteBrand(brand.id_brand!, this.user.id_user!).subscribe((response)=>{
                if(response.status == 200 && response.message === "Eliminado correctamente"){
                    this.getBrands();
                    this.messageService.add({severity:'success', summary: 'Completado', detail: 'Marca Eliminado', life: 3000, sticky: true});
                }else{
                  this.messageService.add({severity:'error', summary: 'Error', detail: 'Ocurrio un error', life: 3000, sticky: true});
                }
            },(err)=>{
              this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un problema en el servidor', life: 3000, sticky: true});
            });
        }
    });
  }

  hideDialog() {
    this.productDialog = false;
  }
}
