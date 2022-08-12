import { Component, Host, OnInit } from '@angular/core';
import { IProvider, IPurchaseOrder, IPurchaseOrderProducts, Product, User } from '@models/interfaces';
import { Message } from 'primeng/api';
import { ProductService } from 'src/app/pages/admin/products/service/product.service';
import { ProviderService } from 'src/app/pages/admin/provider/service/provider.service';
import { PurchaseOrderComponent } from '../../../page/purchase-order.component';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {

  providers: IProvider[] = [];
  selectedProvider: any;
  purchase_order: IPurchaseOrder = {} as IPurchaseOrder;
  selectedProducts: IPurchaseOrderProducts[] = [];
  product: IPurchaseOrderProducts = {} as IPurchaseOrderProducts;
  displayModal: boolean = false;
  products: Product[] = [];
  productAux: Product[] = [];
  user: User = {};
  totalRecords: number = 0;
  arrayAux : any[] = [];
  data : any = {};
  submitted: boolean = false;
  existProveedor: boolean = false;
  isLoadingProvider: boolean = false;
  showErrors: boolean = false;
  msgs1: Message[] = [];
  emptyMessage: string = "No se encontraron resultados";

  constructor(
    private providerService: ProviderService,
    private productService : ProductService,
    @Host() private purchaseComponent: PurchaseOrderComponent
  ) { 
    this.msgs1.push({severity:'error', summary: 'Error', detail: 'Ocurrio un error en el servidor, por favor inténtalo más tarde'});
  }

  ngOnInit(): void {
    this.getUser();
    this.getProviders();
    this.getProducts();
  }

  getUser(){
    const data = localStorage.getItem('user');

    this.user = JSON.parse(data!);
  }

  getProviders(){
    this.isLoadingProvider = true;
    this.providerService.getProviders().subscribe((response : IProvider[])=>{
      response = response.filter( i => i.provider_name != 'NO_DEFINIDO' && i.provider_qualified == 1 && i.provider_status == 1)
      this.providers = Object.values(response);
      this.providers = this.providers.sort(this.sortProviders)
      this.isLoadingProvider = false;
    }, err =>{
      this.showErrors = true;
    })
  }

  getProducts(){
    this.productService.getProducts().subscribe((response : Product[])=>{
      this.productAux = Object.values(response);
    }, err =>{
      this.showErrors = true;
    })
  }

  sortProviders(x : any ,y : any){
    if(x.provider_name < y.provider_name) return -1;
    if(x.provider_name > y.provider_name) return 1;
    return 0;
  }

  saveData(){
    this.existProveedor = true;
    if(!this.selectedProvider) return;

    this.purchase_order.id_provider = this.selectedProvider.id_provider;
    this.purchase_order.id_user = this.user.id_user!;

    this.purchaseComponent.savePurchaseOrder(this.purchase_order);
  }

  addProduct(){
    let index = 0;
    this.submitted = true;
    if(!this.validateData()) return;

    index = this.selectedProducts.findIndex((e) => e.product.id_product === this.product.product.id_product);

    if(index != -1){
      this.selectedProducts[index].amount += this.product.amount;
    } else{
      this.selectedProducts.push(this.product);
    }
    
    this.selectedProducts = Object.values(this.selectedProducts);
    this.sendData();
  }

  sendData(){
    let index = 0;

    try {
      this.data = {
        id_product: this.product.product.id_product!,
        amount: this.product.amount
      }
      
      console.log(this.data)
      index = this.arrayAux.findIndex((e) => e.id_product === this.data.id_product);
      
      if(index != -1){
        this.arrayAux[index].amount += this.data.amount;
      }else{
        this.arrayAux.push(this.data);  
      }
    } catch (error) {
    }

    this.purchase_order.products = Object.values(this.arrayAux);
    this.totalRecords = this.selectedProducts.length;
    this.product = {} as IPurchaseOrderProducts;
    this.submitted = false;
  }

  deleteItem(product: IPurchaseOrderProducts){
    let index = this.selectedProducts.findIndex((e) => e.product.id_product === product.product.id_product);

    if(index != -1) this.selectedProducts.splice(index,1);
    this.totalRecords = this.selectedProducts.length;
  }


  validateData(){
    if(!this.product.product || this.product.amount == null ) return false;
    return true;
  }

  resetData(){
    this.selectedProducts = [];
    this.selectedProvider = null;
    this.selectedProducts = [];
    this.arrayAux = [];
    this.product = {} as IPurchaseOrderProducts;
    this.existProveedor = false;
  }

  getIdProvider($event: any): void{
    let id = this.selectedProvider.id_provider;

    this.products = this.productAux.filter(i=> i.id_provider == id);
  }
}
