import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AddressUserService {

  url : string = environment.API;
  
  constructor(private http : HttpClient) { }

  getAddress(idUser : number) : Observable<any>{
    return this.http.post<any>(`${this.url}/address/${idUser}`,'');
  }
}
