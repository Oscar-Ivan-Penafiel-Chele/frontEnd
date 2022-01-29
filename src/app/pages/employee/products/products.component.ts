import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product-service.service';
import * as FileSaver from 'file-saver';
import { HomeService } from 'src/app/services/home.service';
import { Category } from 'src/app/models/category';
import { Brand } from 'src/app/models/brand';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  providers : [MessageService,ConfirmationService]
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
    val : number = 0;
    isPhoto : boolean = false;
    file : File | undefined;
    photoSelected? : string | ArrayBuffer | null;
    inputFile :boolean = false;
    fileSize : string = "";
    descriptionSize : string = "";
    selectedCategories: Category[] = [];
    categories : Category[] = [];
    states : any[] = [];

    constructor(
        private productService: ProductService, 
        private messageService: MessageService, 
        private confirmationService: ConfirmationService,
        private _homeService : HomeService) { }

    ngOnInit(): void {
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

    getPhotoSelected(event : any){
        if(event.target.files && event.target.files[0]){
            this.file = <File>event.target.files[0];
            this.getSizeImage(this.file.size);

            const reader = new FileReader;
            reader.onload = e => this.photoSelected = reader.result;
            reader.readAsDataURL(this.file);
            this.isPhoto = true;
            this.inputFile = true;
            
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
        })
    }

    clearImage(){
        this.isPhoto = false;
        this.inputFile = false;
        this.file = undefined;
        this.photoSelected = "";
        console.log(this.photoSelected);
    }

    saveProduct() {
        // console.log(this.product.inventoryStatus);
        console.log(this.product.id_brand);
        //   this.submitted = true;
    
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
      this.product = {...product};
      this.productDialog = true;
    }

    deleteProduct(product: Product) {
      this.confirmationService.confirm({
          message: '¿Estás seguro de eliminar el producto: ' + product.name + '?',
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
