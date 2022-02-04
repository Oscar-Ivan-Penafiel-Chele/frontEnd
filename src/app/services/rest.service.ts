import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { IProvider } from '../models/provider';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  API : string = "http://localhost:8000/api";
  
  constructor(private _http : HttpClient) { }

  /* PRODUCTO */

  createProduct(data : FormData): Observable<Product>{
    return this._http.post<Product>(`${this.API}/products`,data);
  }

  /* PROVEEDOR */
  getProviders() : Observable<IProvider[]>{
    return this._http.get<IProvider[]>('assets/data/providers.json');
  }

}
