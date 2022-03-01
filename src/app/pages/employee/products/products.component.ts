import { Component, OnInit, Provider } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService, Message, PrimeNGConfig } from 'primeng/api';
import { Product } from 'src/app/models/product';
import * as FileSaver from 'file-saver';
import { Category } from 'src/app/models/category';
import { Brand } from 'src/app/models/brand';
import { UpperCasePipe } from '@angular/common';
import { RestService } from 'src/app/services/rest.service';
import { IProvider } from 'src/app/models/provider';
import { TokenService } from 'src/app/services/token.service';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment.prod';
import { Measure } from 'src/app/models/measure';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  providers : [MessageService,ConfirmationService, UpperCasePipe]
})
export class ProductsComponent implements OnInit {

    products : Product[] = [];
    productsActive : Product [] = [];
    productsInactive : Product [] = [];

    categories : Category[] = [];
    brands : Brand[] = [];
    providers : IProvider[] = [];
    measures : Measure[] = [];
    user : User = {};
   
    
    brand : Brand = {} as Brand;
    product : Product = {} as Product;
   
    isPhoto : boolean = false;
    isPhotoEdit : boolean;
    isError : boolean ;
    submitted: boolean = false;
    inputFile :boolean = false;
    productDialog: boolean = false;
    uploadFileExcel : boolean = false;
    uploadedFiles : any[] = [];
    sizeFileValid : boolean = false;
    fileExtensionValid : boolean = false;

    selectedProducts: Product[] = [];
    
    statuses: any[] = [];
    cols: any[] = [];
    exportColumns: any[] = [];
    fileTmp : any;
    states : any[] = [];
    
    photoSelected? : string | ArrayBuffer | null;
    fileSize : string = "";
    descriptionSize : string = "";
    actionSelected  : string ="";
    host : string = environment.URL;
    
    idCategory : string = "";
    i : number = 0;
    idProduct : number = 0;
    
    msgs1: Message[] = [];

    stateCheckActive : boolean = true;
    stateCheckInactive : boolean = false;
    productsAux : Product[] = [];
    isDisabled : boolean = true;
    visible : boolean = false;

    codeProduct : number = 0;
    nameProd : string = "";

    imageExcel = "assets/img/IconExcel.svg";
    overImage : string = "assets/img/not_image.jpg";
    invalidFileTypeMessageSummary : string = `Tipo de archivo inválido:`;
    invalidFileTypeMessageDetail : string = `Tipo de archivo permitido .xlsx`;

    constructor(
        private _rest : RestService,
        private messageService: MessageService, 
        private confirmationService: ConfirmationService,
        private _sortByOrder : UpperCasePipe,
        private _token : TokenService
        ) { 

            this.isPhotoEdit = false;
            this.isError = false;

        }

    ngOnInit(): void {
        this.msgs1 = [
            {severity:'warn', summary:'Warning', detail:'Message Content'}
          ];
        this.states = [
            {name: 'Activo', id: 1, icon : 'pi pi-thumbs-up'},
            {name: 'Inactivo', id: 0, icon : 'pi pi-thumbs-down'},
        ]
        this.getAllProducts();
        this.getCodeProduct();
        this.getAllCategories();
        this.getAllBrands();
        this.getAllProviders();
        this.getDataProfile();
        this.getMeasures();
        this.fileTmp = {};
    }

    /* GET */

    getAllProducts() {
        this._rest.getProducts()
        .subscribe((response : Product[]) =>{
            this.productsAux = response;
            if(this.stateCheckActive && !this.stateCheckInactive){
                this.products = this.productsAux.filter(i => i.product_status == 1)
              }else if(!this.stateCheckActive && this.stateCheckInactive){
                this.products = this.productsAux.filter(i => i.product_status == 0)
              }else if(this.stateCheckActive && this.stateCheckInactive){
                this.products = this.productsAux;
              }
        });
    }
    
    getCodeProduct(){
        this._rest.getCodeProduct().subscribe((response)=>{
            if(response.status == 200){
                this.codeProduct = response.message;
            }
        });
    }

    change($event : any){
        if(this.stateCheckActive && this.stateCheckInactive){
             this.products = this.productsAux; 
        }

        if(!this.stateCheckActive && !this.stateCheckInactive) this.products = [] ;

        this.getProductsActives();
        this.getProductsInactives();
    }

    getProductsActives(){
        if(this.stateCheckActive && !this.stateCheckInactive){
            this.products = this.productsAux.filter( i => i.product_status == 1);
        }
    }

    getProductsInactives(){
        if(!this.stateCheckActive && this.stateCheckInactive){
            this.products = this.productsAux.filter( i => i.product_status == 0);
        }
    }

    getAllCategories() {
        this._rest.getCategories()
        .subscribe((response) =>{
          this.categories = Object.values(response);
          this.categories = this.categories.sort(this.sortCategories);
          this.categories = this.categories.filter((i)=> i.category_status == 1);
        });
    }

    sortCategories(x : any ,y : any){
        if(x.category_name < y.category_name) return -1;
        if(x.category_name > y.category_name) return 1;
        return 0;
    }

    getAllBrands(){
        this._rest.getBrands()
        .subscribe((response : Brand[]) => {
          this.brands = Object.values(response);
          this.brands = this.brands.sort(this.sortBrands);
          this.brands = this.brands.filter((i)=> i.brand_status == 1);
        })
    }

    sortBrands(x : any ,y : any){
        if(x.brand_name < y.brand_name) return -1;
        if(x.brand_name > y.brand_name) return 1;
        return 0;
    }

    getAllProviders(){
        this._rest.getProviders()
        .subscribe((response) =>{
            this.providers = <IProvider[]>response;
            for( this.i = 0 ; this.i < this.providers.length ; this.i++){
                this._sortByOrder.transform(`${this.providers[this.i].provider_name}`);
            }
            this.providers = this.providers.filter((i)=> i.provider_status == 1);
        })
    }

    getDataProfile(){
        const data = this._token.getTokenDataUser() as string;
        this.user = JSON.parse(data);
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
            this.product.product_image = this.fileTmp.fileName;
        }
    }

    getMeasures(){
        this._rest.getMeasure()
        .subscribe((response) =>{
            this.measures = <Measure[]>response;
            for( this.i = 0 ; this.i < this.measures.length ; this.i++){
                this._sortByOrder.transform(`${this.measures[this.i].description_product_unit}`);
            }
            this.measures = this.measures.filter((i)=> i.product_unit_status == 1)
        })
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

    openNew() {
        this.actionSelected = "new"
        this.isPhoto = false;  // Le decimos que no hay foto
        this.inputFile = false; // Le decimos que habilite el inputFile
        this.product = {} as Product; // seteamos el producto
        this.fileTmp = {};  // seteamos el archivo de las imagenes
        this.submitted = false; // le decimos que no valide ningun campo
        this.productDialog = true; // abrimos el modal
        this.isPhotoEdit = false; // LE decimos que no es una imagen a editar
        this.product.product_status = 1;  // asignamos el status por defecto a : Activo
        this.product.product_code = this.codeProduct;
    }

    openModalUpload(){
        this.uploadFileExcel = true;
        this.visible = false;
    }

    onUpload($event:any){
        this.visible = true;
        if($event.files[0].size < 1048576){
            this.descriptionSize = "kb";
        }else if($event.files[0].size >= 1048576){
            this.descriptionSize = "mb";
        }
    }

    upLoadFile($event:any){
        this.uploadFileExcel = false;
        const fileExcel = new FormData();
        fileExcel.append('excel',$event.files[0]);
        fileExcel.append('id_user',String(this.user.id_user));
        
        this._rest.uploadStock(fileExcel).subscribe((response : any)=>{
            if(response.status == 200){
                this.messageService.add({severity:'success', summary: 'Completado', detail: 'Archivo subido con éxito', life: 3000});
                $event=[];
                this.visible = false;
                this.uploadFileExcel = false;
            }

        })
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

    clearImage(){
        this.isPhoto = false;
        this.inputFile = false;
        this.fileTmp = {};
        this.photoSelected = "";
        this.isPhotoEdit = false;
        this.product.product_image = 'null';
    }

    editProduct(product: Product) {
        this.actionSelected = "edit"
        this.product = {...product};
        this.isPhoto = true;   // Le decimos que si hay foto
        this.inputFile = true; // LE decimos que bloquee el inputFile
        this.isPhotoEdit = true; // Le decimos que si hay foto para editar
        this.productDialog = true; // abrimos modal
        this.nameProd = product.product_name!;
      }

    saveProduct() {
        if(this.actionSelected === "new"){
            this.submitted = true
    
            if(!this.validateData()){
                return ;
            }
            
            this.validateNameProduct();

        }else if(this.actionSelected === "edit"){
            if(this.nameProd != this.product.product_name){
                this.validateNameProduct();
                return;
            }
            if(this.isObjEmpty(this.fileTmp)){
                //Se envia la misma imagen 
                this.fileTmp = {};
                if(!this.validateDataNoImage()){
                    return ;
                }
                if(!this.product.product_image){
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

    validateNameProduct(){
        console.log(this.product.product_name);
        this._rest.validateNameProduct(this.product.product_name!).subscribe((response)=>{
            if(response.status == 200 && response.message == "No existe"){
                if(this.actionSelected == "new"){
                    this.saveData();
                    return;
                }
            }else if(response.status == 200 && response.message == "Existe"){
                this.messageService.add({severity:'error', summary: 'Error', detail: 'Ya existe un producto con ese nombre', life: 3000});
            }else{
                this.messageService.add({severity:'error', summary: 'Error', detail: 'Ocurrio un problema', life: 3000});
            }
        });
    }

    saveData() : void{
        this.product.id_user = this.user.id_user!;
        this.product.id_category = parseInt(this.product.id_category);

        const data = new FormData();
        data.append('image', this.fileTmp.fileRaw);
        Object.entries(this.product).forEach(([key , value]) => {
            data.append(`${key}`, value);
        });
            
        this._rest.createProduct(data)
            .subscribe((response)=>{
                if(response.status == 200 || response.message === "Producto creado con exito"){
                    this.getAllProducts();
                    this.hideDialog();
                    this.getCodeProduct();
                    this.messageService.add({severity:'success', summary: 'Completado', detail: 'El producto fue creado con éxito', life: 3000});
                }
            });
    }


    updateData(existImage : boolean){
        this.product.id_user = this.user.id_user!;
        this.product.id_category = parseInt(this.product.id_category);

        const data = new FormData();

        if(existImage){
            data.append('image', this.fileTmp.fileRaw);
        }

        Object.entries(this.product).forEach(([key , value]) => {
            data.append(`${key}`, value);
        });

        this._rest.updateProduct(data, this.product.id_product!)
        .subscribe((response)=>{
            if(response.status == 200 || response.message === "Producto actualizado con exito"){
                this.getAllProducts();
                this.hideDialog();
                this.getCodeProduct();
                this.messageService.add({severity:'success', summary: 'Completado', detail: 'El producto fue actualizado con éxito', life: 3000});
            }else if(response.status == 400 || response.status == 500 || response.message === "Ocurrio un error interno en el servidor"){
                this.hideDialog();
                this.messageService.add({severity:'error', summary: 'Error', detail: 'Ocurrio un error, inténtalo más tarde', life: 3000});
            }
        });
    }

    validateData(){
        if(this.isObjEmpty(this.fileTmp) || !this.product.product_name || !this.product.product_description || !this.product.product_code || !this.product.product_price || this.product.product_stock == null || !this.product.id_provider || !this.product.id_brand || this.product.product_status == null || !this.product.product_rating || this.product.id_category == null){
            return false;
        }
      
        return true;
    }

    validateDataNoImage(){
        if(!this.product.product_name || !this.product.product_description || !this.product.product_code || !this.product.product_price || this.product.product_stock == null || !this.product.id_provider || !this.product.id_brand || !this.product.product_rating || !this.product.id_category || this.product.product_status == null){
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

    regexCode(event: any) {
        event.target.value = event.target.value.replace(/[^0-9a-zA-ZáéíñóúüÁÉÍÑÓÚÜ_-]/g, "");
    }

    exportPdf() {
        // import("jspdf").then(jsPDF => {
        //     import("jspdf-autotable").then(x => {
        //         const doc = new jsPDF.default(0,0);
        //         doc.autoTable(this.exportColumns, this.products);
        //         doc.save('products.pdf');
        //     })
        // })
    }

   

    deleteProduct(product: Product) {
      this.confirmationService.confirm({
          message: '¿Estás seguro de eliminar el producto: ' + '"'+product.product_name + '"'+'?',
          header: 'Eliminar Producto',
          acceptLabel : 'Eliminar',
          rejectLabel : 'Cancelar',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
              this._rest.deleteProduct(product.id_product).subscribe((response)=>{
                  if(response.status == 200 || response.message === "Eliminado correctamente"){
                      this.getAllProducts();
                      this.getCodeProduct();
                      this.messageService.add({severity:'success', summary: 'Completado', detail: 'Producto Eliminado', life: 3000});
                  }
              },(err)=>{
                console.log(err.error);
              });
          }
      });
    }

    hideDialog() {
        this.productDialog = false;
    }

    exportExcel(){
        this._rest.downloadExcel().subscribe((response)=>{
            console.log(response);
        })
    }
}
