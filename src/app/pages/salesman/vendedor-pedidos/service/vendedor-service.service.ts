import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class VendedorServiceService {

  url : string = environment.API;

  constructor(private _http : HttpClient) { }

  getPendingOrders() : Observable<any>{
    return this._http.get<any>(`${this.url}/order/seller`);
  }
  
  changeStateOrder(data : any) : Observable<any>{
    return this._http.post<any>(`${this.url}/order/change`,data);
  }
}
