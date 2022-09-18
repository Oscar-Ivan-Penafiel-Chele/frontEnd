import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ValidationsService {

  url : string = environment.API;

  constructor(private _http : HttpClient) { }

  validatePassword(opc : any) : Observable<any>{
    return this._http.post<any>(`${this.url}/validate/user/password`, opc);
  }

  validateNameProduct(nameProduct : string) : Observable<any>{
    const data = {'product_name':nameProduct}
    return this._http.post<any>(`${this.url}/validate/product/name`,data);
  }

  validateEmailDuplicate(data : any) :Observable<any>{
    return this._http.post(`${this.url}/validate/user/email`,data);
  }

  validateIdentificationDuplicate(data : any) :Observable<any>{
    return this._http.post<any>(`${this.url}/validate/user/identification`,data);
  }

  validatePromotionProduct(data : any) : Observable<any>{
    return this._http.post(`${this.url}/validate/promotion/product`,data);
  }

  validateAddressDelete(id_address : number) : Observable<any>{
    return this._http.post<any>(`${this.url}/validate/address/order`, {id_address});
  }

  validateStockProduct(data: any): Observable<any>{
    return this._http.post<any>(`${this.url}/validate/product/stock`,data);
  }

  validateProviderName(data: any){
    return this._http.post<any>(`${this.url}/validate/provider/name`,data);
  }

  validateProviderIdentification(data: any){
    return this._http.post<any>(`${this.url}/validate/provider/identification`,data);
  }

  validateRequestChangePassword(id_user: number): Observable<any>{
    return this._http.post<any>(`${this.url}/validate/exists/change/password`,{id_user});
  }
}
