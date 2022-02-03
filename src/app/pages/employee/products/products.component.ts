import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService, Message, PrimeNGConfig } from 'primeng/api';
import { Product } from 'src/app/models/product';
import * as FileSaver from 'file-saver';
import { HomeService } from 'src/app/services/home.service';
import { Category } from 'src/app/models/category';
import { Brand } from 'src/app/models/brand';
import { UpperCasePipe } from '@angular/common';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  providers : [MessageService,ConfirmationService, UpperCasePipe]
})
export class ProductsComponent implements OnInit {

    productDialog: boolean = false;
    products : Product[] = [];
    product : Product = {} as Product;
    brands : Brand[] = [];
    brand : Brand = {} as Brand;
    selectedProducts: Product[] = [];
    submitted: boolean = false;
    statuses: any[] = [];
    cols: any[] = [];
    exportColumns: any[] = [];
    isPhoto : boolean = false;
    categorieSelected : number []  = [];
    fileTmp : any;
    photoSelected? : string | ArrayBuffer | null;
    inputFile :boolean = false;
    fileSize : string = "";
    descriptionSize : string = "";
    selectedCategories: Category[] = [];
    categories : Category[] = [];
    states : any[] = [];
    i : number = 0;
    isPhotoEdit : boolean;
    msgs1: Message[] = [];
    isError : boolean ;


    constructor(
        private _rest : RestService,
        private messageService: MessageService, 
        private confirmationService: ConfirmationService,
        private _sortByOrder : UpperCasePipe,
        private _homeService : HomeService) { 

            this.isPhotoEdit = false;
            this.isError = false;

        }

    ngOnInit(): void {
        this.msgs1 = [
            {severity:'warn', summary:'Warning', detail:'Message Content'}
          ];
        this.states = [
            {name: 'Activo', id: '0', icon : 'pi pi-thumbs-up'},
            {name: 'Inactivo', id: '1', icon : 'pi pi-thumbs-down'},
        ]
        this.getAllProducts();
        this.getAllCategories();
        this.getAllBrands();
    }

    getAllProducts() {
    this._homeService.getAllProducts()
    .subscribe((response) =>{
        this.products = <Product[]>response;
    });
    }

    openNew() {
        this.isPhoto = false;  
        this.inputFile = false;
        this.product = {} as Product;
        this.submitted = false;
        this.productDialog = true;
    }

    getPhotoSelected($event : any){
        if($event.target.files && $event.target.files[0]){
            // this.file = <File>event.target.files[0];
            const [ file ] = $event.target.files;
            this.fileTmp = {
                fileRaw : file,
                fileName : file.name,
                fileSize : file.size,
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

    getSizeImage(size : number){
        if(size < 1048576){
            this.fileSize = (size/1000).toFixed(0);
            this.descriptionSize = "kb";
        }else if(size >= 1048576){
            this.fileSize = (size/1000000).toFixed(0);
            this.descriptionSize = "mb";
        }
    }

    getAllCategories() {
        this._homeService.getAllCategories()
        .subscribe((response) =>{
          this.categories = response;
        });
    }

    getAllBrands(){
        this._homeService.getAllBrands()
        .subscribe((response) => {
          this.brands = <Brand[]>response;
          for( this.i = 0 ; this.i < this.brands.length ; this.i++){
              this._sortByOrder.transform(this.brands[this.i].brand_name);
          }
        })
    }

    clearImage(){
        this.isPhoto = false;
        this.inputFile = false;
        this.fileTmp = {};
        this.photoSelected = "";
        this.isPhotoEdit = false;
    }

    saveProduct() {
        this.product.id_user = 1;
        const data = new FormData();
        data.append('image', this.fileTmp.fileRaw);
        Object.entries(this.product).forEach(([key , value]) => {
            data.append(`${key}`, value);
        });
        this._rest.createProduct(data)
            .subscribe((response)=>{
                console.log(response);
            });
        
        
        
            // this.isError = true;
        //   this.submitted = true;
        // console.log(this.product);
        // this.validateData;
        //   if (this.product.name?.trim()) {
        //       if (this.product.id) {
        //           this.products[this.findIndexById(this.product.id)] = this.product;
        //           this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
        //       }
        //       else {
        //           this.product.id = this.createId();
        //           this.product.image = 'product-placeholder.svg';
        //           this.products.push(this.product);
        //           this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Created', life: 3000});
        //       }
    
        //       this.products = [...this.products];
        //       this.productDialog = false;
        //       this.product = {};
        //   }
    }

    validateData(){
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

    deleteSelectedProducts() {
    //   this.confirmationService.confirm({
    //       message: 'Are you sure you want to delete the selected products?',
    //       header: 'Confirm',
    //       icon: 'pi pi-exclamation-triangle',
    //       accept: () => {
    //           this.products = this.products.filter(val => !this.selectedProducts.includes(val));
    //           this.selectedProducts = [];
    //           this.messageService.add({severity:'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
    //       }
    //   });
    }

    editProduct(product: Product) {
      this.isPhoto = true;  
      this.inputFile = true;
      this.isPhotoEdit = true;
      this.product = {...product};
      this.productDialog = true;
    }

    deleteProduct(product: Product) {
      this.confirmationService.confirm({
          message: '¿Estás seguro de eliminar el producto: ' + product.product_name + '?',
          header: 'Eliminar Producto',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            //   this.products = this.products.filter(val => val.id_product !== this.products.id_product);
            //   this.product = {};
              this.messageService.add({severity:'error', summary: 'Completado', detail: 'Producto Eliminado', life: 3000});
          }
      });
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

}
