import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { IProvider } from '../models/provider';
import { Brand } from '../models/brand';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  API : string = "http://127.0.0.1:8000/api";

  constructor(private _http : HttpClient) { }

  /* PRODUCTO */
  getProducts() : Observable<Product[]>{
    return this._http.get<Product[]>(`${this.API}/products`);
  }

  createProduct(data : FormData): Observable<any>{
    return this._http.post<any>(`${this.API}/products`,data);
  }

  updateProduct(data : FormData, id? : number) : Observable<number>{
    return this._http.put<number>(`${this.API}/products/${id}`,data);
  }

  deleteProduct(id? : number) : Observable<any>{
    return this._http.delete<any>(`${this.API}/products/${id}`);
  }


  /* PROVEEDOR */
  getProviders() : Observable<IProvider[]>{
    return this._http.get<IProvider[]>(`${this.API}/providers`);
  }


  /* BRAND */
  getBrands() : Observable<Brand[]>{
    return this._http.get<Brand[]>(`${this.API}/brands`);
  }

}
