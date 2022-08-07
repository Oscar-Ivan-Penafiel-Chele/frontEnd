import { Component, Host, OnInit } from '@angular/core';
import { IProvider, IPurchaseOrder, IPurchaseOrderProducts, Product, User } from '@models/interfaces';
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
  user: User = {};
  totalRecords: number = 0;

  constructor(
    private providerService: ProviderService,
    private productService : ProductService,
    @Host() private purchaseComponent: PurchaseOrderComponent
  ) { }

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
    this.providerService.getProviders().subscribe((response : IProvider[])=>{
      response = response.filter( i => i.provider_name != 'NO_DEFINIDO')
      this.providers = Object.values(response);
      this.providers = this.providers.sort(this.sortProviders)
    })
  }

  getProducts(){
    this.productService.getProducts().subscribe((response : Product[])=>{
      this.products = Object.values(response);
    })
  }

  sortProviders(x : any ,y : any){
    if(x.provider_name < y.provider_name) return -1;
    if(x.provider_name > y.provider_name) return 1;
    return 0;
  }

  saveData(){
    this.purchase_order.id_provider = this.selectedProvider.id_provider;
    this.purchase_order.id_user = this.user.id_user!;

    this.purchaseComponent.savePurchaseOrder(this.purchase_order);
  }

  addProduct(){
    if(!this.validateData()) return;

    this.selectedProducts.push(this.product);
    this.selectedProducts = Object.values(this.selectedProducts);
    this.purchase_order.products = this.selectedProducts;
    this.totalRecords = this.selectedProducts.length;
    this.product = {} as IPurchaseOrderProducts;
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
}
