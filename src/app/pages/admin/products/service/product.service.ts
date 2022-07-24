import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '@models/interfaces';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  url : string = environment.API;

  constructor(private _http : HttpClient) { }

  getCodeProduct() : Observable<any>{
    return this._http.get<any>(`${this.url}/validate/product/code`);
  }

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

  deleteProduct(id? : number, id_user? : number) : Observable<any>{
    return this._http.request('DELETE',`${this.url}/products/${id}`,{
      body : {
        id_user : id_user
      }
    });
  }
}
