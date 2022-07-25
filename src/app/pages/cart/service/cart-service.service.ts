import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart } from '@models/interfaces';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {

  url : string = environment.API;
  
  constructor(private _http : HttpClient) { }

  addProductCart(data : any) : Observable<any>{
    return this._http.post<any>(`${this.url}/shopping/card/add`,data);
  }
  getProductsCart(data : any) : Observable<Cart[]>{
    return this._http.post<Cart[]>(`${this.url}/shopping/card/get`,data); 
  }
  deleteProductCart(data : any) : Observable<any>{
    return this._http.post<any>(`${this.url}/shopping/card/delete`,data);
  }

}
