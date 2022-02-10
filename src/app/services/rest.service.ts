import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { IProvider } from '../models/provider';
import { Brand } from '../models/brand';
import { environment } from 'src/environments/environment.prod';
import { Measure } from '../models/measure';


@Injectable({
  providedIn: 'root'
})
export class RestService {

  url : string = environment.API;

  constructor(private _http : HttpClient) { }

  /* PRODUCTO */
  getProducts() : Observable<Product[]>{
    return this._http.get<Product[]>(`${this.url}/products`);
  }
  createProduct(data : FormData): Observable<any>{
    return this._http.post<any>(`${this.url}/products`,data);
  }
  updateProduct(data : FormData, id : number) : Observable<any>{
    data.append('_method','PUT');
    let headers: HttpHeaders = new HttpHeaders({
      'X-Requested-With': 'XMLHttpRequest'
    });

    return this._http.post<any>(`${this.url}/products/${id}`,data,{headers : headers});
  }

  deleteProduct(id? : number) : Observable<any>{
    return this._http.delete<any>(`${this.url}/products/${id}`);
  }


  /* PROVEEDOR */
  getProviders() : Observable<IProvider[]>{
    return this._http.get<IProvider[]>(`${this.url}/providers`);
  }


  /* BRAND */
  getBrands() : Observable<Brand[]>{
    return this._http.get<Brand[]>(`${this.url}/brands`);
  }
  createBrand(data : FormData) : Observable<any>{
    return this._http.post<any>(`${this.url}/brands`,data);
  }
  updateBrand(data : FormData, id : number) : Observable<any>{
    data.append('_method','PUT');
    let headers: HttpHeaders = new HttpHeaders({
      'X-Requested-With': 'XMLHttpRequest'
    });
    return this._http.post<any>(`${this.url}/brands/${id}`,data,{headers : headers});
  }
  deleteBrand(id:number) : Observable<any>{
    return this._http.delete<any>(`${this.url}/brands/${id}`);
  }


  /* MEDIDAS */
  getMeasure() : Observable<Measure[]>{
    return this._http.get<Measure[]>(`${this.url}/units`);
  }

}
