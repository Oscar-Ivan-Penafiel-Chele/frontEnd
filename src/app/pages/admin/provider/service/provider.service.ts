import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProvider, Type_Provider } from '@models/interfaces';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  url : string = environment.API;
  
  constructor(private _http : HttpClient) { }

  getTypeProviders() : Observable<Type_Provider[]>{
    return this._http.get<Type_Provider[]>(`${this.url}/type-providers`);
  }
  
  getProviders() : Observable<IProvider[]>{
    return this._http.get<IProvider[]>(`${this.url}/providers`);
  }
  createProvider(provider : IProvider) : Observable<any>{
    return this._http.post<any>(`${this.url}/providers`,provider);
  }
  updateProvider(provider : IProvider, id: number) : Observable<any>{
    return this._http.put(`${this.url}/providers/${id}`,provider);
  }
  deleteProvider(id : number, id_user : number) : Observable<any>{
    // return this._http.delete(`${this.url}/providers/${id}`);
    return this._http.request('DELETE',`${this.url}/providers/${id}`,{
      body : {
        id_user : id_user
      }
    });
  }
}
