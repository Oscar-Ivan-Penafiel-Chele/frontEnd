import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPurchaseOrder } from '@models/interfaces';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
  url : string = environment.API;

  constructor(private http : HttpClient) { }

  getPurchaseOrders(): Observable<IPurchaseOrder[]>{
    return this.http.get<IPurchaseOrder[]>(`${this.url}/purchase/order`);
  }

  createPurchaseOrder(data: IPurchaseOrder): Observable<any>{
    return this.http.post<any>(`${this.url}/purchase/order`,data);
  }
}
