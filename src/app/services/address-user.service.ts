import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Address } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AddressUserService {

  url : string = environment.API;
  
  constructor(private http : HttpClient) { }

  getAddress(idUser : number) : Observable<any>{
    return this.http.get<any>(`${this.url}/address/${idUser}`);
  }

  createAddress(address : Address , idUser : number) : Observable<any>{
    const data = {
      id_user : idUser,
      user_address : address.user_address,
      address_description : address.address_description
    }

    return this.http.post<any>(`${this.url}/address`,data);
  }

  updateAddress(idAddress : number, address : Address) :Observable<any>{
    console.log(address)

    const data = {
      user_address : address.user_address,
      address_description : address.address_description
    }

    return this.http.put<any>(`${this.url}/address/${address.id_address}`, data);
  }

  deleteAddress(idAddress : number) :Observable<any>{
    return this.http.delete<any>(`${this.url}/address/${idAddress}`);
  }
}
