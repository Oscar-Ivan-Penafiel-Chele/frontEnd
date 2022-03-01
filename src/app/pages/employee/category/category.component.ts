import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { environment } from 'src/environments/environment.prod';
import { UpperCasePipe } from '@angular/common';
import { MessageService, Message, PrimeNGConfig, ConfirmationService } from 'primeng/api';
import { RestService } from 'src/app/services/rest.service';
import { TokenService } from 'src/app/services/token.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  providers : [MessageService,ConfirmationService, UpperCasePipe]
})
export class CategoryComponent implements OnInit {

  categories : Category[] = [];

  category : Category = {} as Category;
  user : User = {};

  host : string = environment.URL;

  isPhoto : boolean = false;
  isPhotoEdit : boolean;
  isError : boolean ;
  i : number = 0;
  submitted: boolean = false;
  inputFile :boolean = false;
  productDialog: boolean = false;
  sizeFileValid : boolean = false;
  fileExtensionValid : boolean = false;
  fileTmp : any;
  states : any[] = [];
  photoSelected? : string | ArrayBuffer | null;
  fileSize : string = "";
  descriptionSize : string = "";
  actionSelected  : string ="";
  overImage : string = "assets/img/not_image.jpg";
  stateCheckActive : boolean = true;
  stateCheckInactive : boolean = false;
  categoriesAux : Category[] = [];

  constructor(
    private _rest : RestService,
    private messageService: MessageService, 
    private confirmationService: ConfirmationService,
    private _sortByOrder : UpperCasePipe,
    private _token : TokenService,
    ) { 

        this.isPhotoEdit = false;
        this.isError = false;

    }

  ngOnInit(): void {
    this.states = [
      {name: 'Activo', id: 1, icon : 'pi pi-thumbs-up'},
      {name: 'Inactivo', id: 0, icon : 'pi pi-thumbs-down'},
    ]
    this.getCategories();
    this.fileTmp = {};
    this.getDataProfile();
  }

  getDataProfile(){
    const data = this._token.getTokenDataUser() as string;
    this.user = JSON.parse(data);
  }

  getCategories(){
    this._rest.getCategories().subscribe((response : Category[]) => {
      this.categoriesAux = Object.values(response);
      if(this.stateCheckActive && !this.stateCheckInactive){
        this.categories = this.categoriesAux.filter(i => i.category_status == 1);
      }else if(!this.stateCheckActive && this.stateCheckInactive){
        this.categories = this.categoriesAux.filter(i => i.category_status == 0);
      }else if(this.stateCheckActive && this.stateCheckInactive){
        this.categories = this.categoriesAux;
      }
    });
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
        this.category.category_thumbnail = this.fileTmp.fileName;
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

  change($event : any){
    if(this.stateCheckActive && this.stateCheckInactive){
         this.categories = this.categoriesAux; 
    }

    if(!this.stateCheckActive && !this.stateCheckInactive) this.categories = [] ;

    this.getCategoriesActives();
    this.getCategoriesInactives();
  }

  getCategoriesActives(){
    if(this.stateCheckActive && !this.stateCheckInactive){
        this.categories = this.categoriesAux.filter( i => i.category_status == 1);
    }
  }

  getCategoriesInactives(){
      if(!this.stateCheckActive && this.stateCheckInactive){
          this.categories = this.categoriesAux.filter( i => i.category_status == 0)
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
  
  clearImage(){
    this.isPhoto = false;
    this.inputFile = false;
    this.fileTmp = {};
    this.photoSelected = "";
    this.isPhotoEdit = false;
    this.category.category_thumbnail = 'null';
  }

  openNew(){
    this.actionSelected = "new"
    this.isPhoto = false;  // Le decimos que no hay foto
    this.inputFile = false; // Le decimos que habilite el inputFile
    this.category = {} as Category; // seteamos el producto
    this.fileTmp = {};  // seteamos el archivo de las imagenes
    this.submitted = false; // le decimos que no valide ningun campo
    this.productDialog = true; // abrimos el modal
    this.isPhotoEdit = false; // LE decimos que no es una imagen a editar
    this.category.category_status = 1;  // asignamos el status por defecto a : Activo
  }
  
  hideDialog() {
    this.productDialog = false;
  }

  saveCategory(){
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
            if(!this.category.category_thumbnail){
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

  saveData() : void{
    const data = new FormData();
    data.append('image', this.fileTmp.fileRaw);
    Object.entries(this.category).forEach(([key , value]) => {
        data.append(`${key}`, value);
    });
    
    data.append('id_user',String(this.user.id_user));
    this._rest.createCategory(data)
        .subscribe((response)=>{
            if(response.status == 200 || response.message === "Categoria creado con exito"){
                this.getCategories();
                this.hideDialog();
                this.messageService.add({severity:'success', summary: 'Completado', detail: 'La categoría fue creado con éxito', life: 3000});
            }
        });
  }

  updateData(existImage : boolean){
    const data = new FormData();

    if(existImage){
        data.append('image', this.fileTmp.fileRaw);
    }

    Object.entries(this.category).forEach(([key , value]) => {
        data.append(`${key}`, value);
    });

    data.append('id_user',String(this.user.id_user));

    this._rest.updateCategory(data, this.category.id_category!)
    .subscribe((response)=>{
        if(response.status == 200 && response.message === "Categoria actualizada con exito"){
            this.getCategories();
            this.hideDialog();
            this.messageService.add({severity:'success', summary: 'Completado', detail: 'La categoria fue actualizado con éxito', life: 3000});
        }else if(response.status == 400 || response.status == 500 || response.message === "Ocurrio un error interno en el servidor"){
            this.hideDialog();
            this.messageService.add({severity:'error', summary: 'Error', detail: 'Ocurrio un error, inténtalo más tarde', life: 3000});
        }
    });
  }

  validateData(){
    if(this.isObjEmpty(this.fileTmp) || !this.category.category_name || !this.category.category_descripcion || this.category.category_status == null){
        return false;
    }
  
    return true;
  }

  validateDataNoImage(){
      if(!this.category.category_name || !this.category.category_descripcion || this.category.category_status == null){
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

  editCategory(category : Category){
    this.actionSelected = "edit"
    this.category = {...category};
    this.isPhoto = true;   // Le decimos que si hay foto
    this.inputFile = true; // LE decimos que bloquee el inputFile
    this.isPhotoEdit = true; // Le decimos que si hay foto para editar
    this.productDialog = true; // abrimos modal
  }

  deleteCategory(category : Category){
    this.confirmationService.confirm({
        message: '¿Estás seguro de eliminar la categoría: ' + category.category_name + '?',
        header: 'Eliminar Categoría',
        acceptLabel : 'Eliminar',
        rejectLabel : 'Cancelar',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this._rest.deleteCategory(category.id_category).subscribe((response)=>{
                if(response.status == 200 || response.message === "Eliminado correctamente"){
                    this.getCategories();
                    this.messageService.add({severity:'success', summary: 'Completado', detail: 'Categoría Eliminado', life: 3000});
                }
            },(err)=>{
              console.log(err.error);
            });
        }
    });
  }

  exportPdf() {}
}
