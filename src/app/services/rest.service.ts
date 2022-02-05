import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { IProvider } from '../models/provider';
import { Product_Category } from '../models/product_category';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  API : string = "http://localhost:8000/api";
  
  constructor(private _http : HttpClient) { }

  /* PRODUCTO */
  getProducts() : Observable<Product[]>{
    return this._http.get<Product[]>(`${this.API}/products`);
  }

  createProduct(data : FormData): Observable<number>{
    return this._http.post<number>(`${this.API}/products`,data);
  }

  createProductCategory(data : Product_Category) : Observable<any>{
    return this._http.post<any>(`${this.API}/productCategory`,data);
  }


  /* PROVEEDOR */
  getProviders() : Observable<IProvider[]>{
    return this._http.get<IProvider[]>('assets/data/providers.json');
  }

}
