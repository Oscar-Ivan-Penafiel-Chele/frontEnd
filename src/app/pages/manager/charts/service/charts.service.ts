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

  getSails(data: any): Observable<any>{
    return this._http.post<any>(`${this.url}/sales/by/date`,data)
  }

  getProductsByCategory(): Observable<any>{
    return this._http.get<any>(`${this.url}/products/by/category`)
  }

  getOrders(data: any): Observable<any>{
    return this._http.post<any>(`${this.url}/orders/by/status`, data)
  }

  getTypePayGraphic(data: any){
    return this._http.post<any>(`${this.url}/type-pay/orders`,data);
  }
}
