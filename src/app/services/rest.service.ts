import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  API : string = "https://localhost:8000/api";
  
  constructor(private _http : HttpClient) { }

  createProduct(data : FormData): Observable<Product>{
    return this._http.post<Product>(`${this.API}/products`,data);
  }
}
