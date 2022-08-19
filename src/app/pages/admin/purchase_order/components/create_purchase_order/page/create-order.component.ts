import { Component, Host, OnInit } from '@angular/core';
import { IProvider, IPurchaseOrder, IPurchaseOrderProducts, Product, User } from '@models/interfaces';
import { Message } from 'primeng/api';
import { ProductService } from 'src/app/pages/admin/products/service/product.service';
import { ProviderService } from 'src/app/pages/admin/provider/service/provider.service';
import { PurchaseOrderComponent } from '../../../page/purchase-order.component';
import {ConfirmationService, ConfirmEventType, MessageService} from 'primeng/api';
import { TokenService } from 'src/app/auth/service/token.service';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class CreateOrderComponent implements OnInit {

  providers: IProvider[] = [];
  providersAux: IProvider[] = [];
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
  isLoadingProduct: boolean = false;
  showErrors: boolean = false;
  msgs1: Message[] = [];
  emptyMessage: string = "No se encontraron resultados";
  searchInput: string ="";
  textSearch: string = "";
  options: any[] = []
  prueba: any;

  constructor(
    private providerService: ProviderService,
    private productService : ProductService,
    private _token : TokenService,
    @Host() private purchaseComponent: PurchaseOrderComponent,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService
  ) { 
    this.msgs1.push({severity:'error', summary: 'Error', detail: 'Ocurrio un error en el servidor, por favor inténtalo más tarde'});
  }

  ngOnInit(): void {
    this.getUser();
    this.getProviders();
    this.getProducts();
  }

  getUser(){
    const data = this._token.getTokenDataUser();
    this.user = data;
  }

  getProviders(){
    this.isLoadingProvider = true;
    this.providerService.getProviders().subscribe((response : IProvider[])=>{
      response = response.filter( i => i.provider_name != 'NO_DEFINIDO' && i.provider_qualified == 1 && i.provider_status == 1)
      this.providers = Object.values(response);
      this.providers = this.providers.sort(this.sortProviders);
      this.providersAux = this.providers;
      this.getOptions(this.providers);
      this.isLoadingProvider = false;
    }, err =>{
      this.showErrors = true;
    })
  }

  getOptions(prov: IProvider[]){
    prov.forEach((i: IProvider)=>{
      this.options.push({name: i.provider_name!});
    })
  }

  getProducts(){
    this.isLoadingProduct = true;
    this.productService.getProducts().subscribe((response : Product[])=>{
      this.productAux = Object.values(response);
      this.isLoadingProduct = false;
    }, err =>{
      this.showErrors = true;
      this.isLoadingProduct = false;
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
        product_name: this.product.product.product_name,
        amount: this.product.amount
      }
      
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
    this.product = {} as IPurchaseOrderProducts;

    if(this.selectedProducts.length > 0){
      this.selectedProducts = [];
    }
  }

  emptySelectProducts(){
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar todos los productos seleccionados?',
      header: 'Confirmar',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-info',
      rejectButtonStyleClass: 'p-button-danger p-button-text',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.selectedProducts = [];
      },
    });
  }
}
