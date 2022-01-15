import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Brand } from '../models/brand';
import { Category } from '../models/category';
import { NavigationItem } from '../models/navigation';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private _http : HttpClient) { }

  API_URL : string = "https://localhost:3800/";
  pathBrand : string = "assets/data/brands.json";
  pathCategories : string = "assets/data/categories.json";
  pathItemNavigation : string = "assets/data/itemNavigation.json";
  pathItemNFooter : string = "assets/data/footer_items.json";

  getAllItemNavigation() : Observable<NavigationItem[]>{
    return this._http.get<NavigationItem[]>(this.pathItemNavigation);
  }

  getAllCategories(): Observable<Category[]>{
    return this._http.get<Category[]>(this.pathCategories);
  }

  getAllBrands() : Observable<Brand[]>{
    return this._http.get<Brand[]>(this.pathBrand);
  }


  // getProducts() : Observable<Product[]>{
  //   return this._http.get<Product[]>('assets/data/products.json')
  // }
  getProducts() {
    return this._http.get<any>('assets/data/products.json')
    .toPromise()
    .then(res => <Product[]>res.data)
    .then(data => { return data; });
}
}
