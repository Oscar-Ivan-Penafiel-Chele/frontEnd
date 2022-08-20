import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '@models/interfaces';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ChartsService {
  url : string = environment.API;
  
  constructor(private _http : HttpClient) { }

  getCategoriesProducts(): Observable<Category[]>{
    return this._http.get<Category[]>(`${this.url}/categories/products`)
  }

  getSails(): Observable<any>{
    return this._http.post<any>(`${this.url}/sales/all`,'')
  }

  getProductsByCategory(): Observable<any>{
    return this._http.get<any>(`${this.url}/products/by/category`)
  }

  getOrders(): Observable<any>{
    return this._http.post<any>(`${this.url}/orders/by/status`,"")
  }
}