import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationOrderService {

  url : string = environment.API;

  constructor(private _http : HttpClient) { }

  createOrder(data : any) : Observable<any>{
    return this._http.post<any>(`${this.url}/createOrder`,data);
  }

  sendEmail(email : string) : Observable<any>{
    return this._http.post<any>(`${this.url}/send-email`,{email});
  }
}
