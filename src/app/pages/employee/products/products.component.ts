import { Component, OnInit, Provider } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService, Message, PrimeNGConfig } from 'primeng/api';
import { Product } from 'src/app/models/product';
import * as FileSaver from 'file-saver';
import { HomeService } from 'src/app/services/home.service';
import { Category } from 'src/app/models/category';
import { Brand } from 'src/app/models/brand';
import { UpperCasePipe } from '@angular/common';
import { RestService } from 'src/app/services/rest.service';
import { IProvider } from 'src/app/models/provider';
import { TokenService } from 'src/app/services/token.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  providers : [MessageService,ConfirmationService, UpperCasePipe]
})
export class ProductsComponent implements OnInit {

    products : Product[] = [];
    categories : Category[] = [];
    brands : Brand[] = [];
    providers : IProvider[] = [];
    user : User = {};
   
    
    brand : Brand = {} as Brand;
    product : Product = {} as Product;
   
    isPhoto : boolean = false;
    isPhotoEdit : boolean;
    isError : boolean ;
    submitted: boolean = false;
    inputFile :boolean = false;
    productDialog: boolean = false;
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
    host : string = "http://127.0.0.1:8000";
    
    // categorieSelected : number []  = [];
    idCategory : string = "";
    i : number = 0;
    idProduct : number = 0;
    
    msgs1: Message[] = [];

    constructor(
        private _rest : RestService,
        private messageService: MessageService, 
        private confirmationService: ConfirmationService,
        private _sortByOrder : UpperCasePipe,
        private _homeService : HomeService,
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
        this.getAllCategories();
        this.getAllBrands();
        this.getAllProviders();
        this.getDataProfile();
        this.fileTmp = {};
    }

    /* GET */

    getAllProducts() {
        this._rest.getProducts()
        .subscribe((response : Product[]) =>{
            this.products = Object.values(response);
            console.log(this.products);
        });
    }

    getAllCategories() {
        this._homeService.getAllCategories()
        .subscribe((response) =>{
          this.categories = response;
        });
    }

    getAllBrands(){
        this._rest.getBrands()
        .subscribe((response) => {
          this.brands = <Brand[]>response;
          for( this.i = 0 ; this.i < this.brands.length ; this.i++){
              this._sortByOrder.transform(this.brands[this.i].brand_name);
          }
        })
    }

    getAllProviders(){
        this._rest.getProviders()
        .subscribe((response) =>{
            this.providers = <IProvider[]>response;
            for( this.i = 0 ; this.i < this.providers.length ; this.i++){
                this._sortByOrder.transform(`${this.providers[this.i].provider_name}`);
            }
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

    getSizeImage(size : number) : void{
        if(size < 1048576){
            this.fileSize = (size/1000).toFixed(0);
            this.descriptionSize = "kb";
        }else if(size >= 1048576){
            this.fileSize = (size/1000000).toFixed(0);
            this.descriptionSize = "mb";
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

    openNew() {
        this.actionSelected = "new"
        this.isPhoto = false;  
        this.inputFile = false;
        this.product = {} as Product;
        this.fileTmp = {};
        this.submitted = false;
        this.productDialog = true;
        this.product.product_status = 1;
    }


    clearImage(){
        this.isPhoto = false;
        this.inputFile = false;
        this.fileTmp = {};
        this.photoSelected = "";
        this.isPhotoEdit = false;
    }

    saveProduct() {
        if(this.actionSelected === "new"){
            this.submitted = true
    
            if(!this.validateData()){
                return ;
            }
            
            this.saveData();

        }else if(this.actionSelected === "edit"){
            if(this.isObjEmpty(this.fileTmp)){
                //Si esta vacio
                // if(this.validateDataNoImage()){
                //     return ;
                // }

                console.log(this.product);

            }else{
                this.submitted = true
                if(!this.validateData()){
                    return ;
                }
                //No esta vacio
            }
        }
    }

    saveData() : void{
        this.product.id_user = parseInt(this.user.id_user!);
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
                    this.messageService.add({severity:'success', summary: 'Completado', detail: 'El producto fue creado con éxito'});
                }
            });
    }

    validateData(){
        if(this.isObjEmpty(this.fileTmp) || !this.product.product_name || !this.product.product_description || !this.product.product_code || !this.product.product_price || !this.product.product_stock || !this.product.id_provider || !this.product.id_brand || !this.product.product_status || !this.product.product_rating || this.product.id_category == null){
            return false;
        }
      
        return true;
    }

    validateDataNoImage(){
        if(!this.product.product_name || !this.product.product_description || !this.product.product_code || !this.product.product_price || !this.product.product_stock || !this.product.id_provider || !this.product.id_brand || !this.product.product_status || !this.product.product_rating || this.product.id_category == null){
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

    editProduct(product: Product) {
      this.actionSelected = "edit"
      this.product = {...product};
    //   product.producto_categorias.forEach((i)=>{
    //     this.categorieSelected.push(i.id_category.toString());
    //   });
      this.isPhoto = true;  
      this.inputFile = true;
      this.isPhotoEdit = true;
      this.productDialog = true;
    }

    deleteProduct(product: Product) {
      this.confirmationService.confirm({
          message: '¿Estás seguro de eliminar el producto: ' + product.product_name + '?',
          header: 'Eliminar Producto',
          acceptLabel : 'Eliminar',
          rejectLabel : 'Cancelar',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
              this._rest.deleteProduct(product.id_product).subscribe((response)=>{
                  if(response.status == 200 || response.message === "Eliminado correctamente"){
                      this.getAllProducts();
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

}
