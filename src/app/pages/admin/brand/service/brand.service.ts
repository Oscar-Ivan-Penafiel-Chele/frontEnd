import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand } from '@models/interfaces';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  url : string = environment.API;
  
  constructor(private _http : HttpClient) { }

  getBrands() : Observable<Brand[]>{
    return this._http.get<Brand[]>(`${this.url}/brands`);
  }

  createBrand(data : FormData) : Observable<any>{
    return this._http.post<any>(`${this.url}/brands`,data);
  }

  updateBrand(data : FormData, id : number) : Observable<any>{
    data.append('_method','PUT');
    let headers: HttpHeaders = new HttpHeaders({
      'X-Requested-With': 'XMLHttpRequest'
    });
    return this._http.post<any>(`${this.url}/brands/${id}`,data,{headers: headers});
  }

  deleteBrand(id:number, id_user : number) : Observable<any>{
    return this._http.request('DELETE',`${this.url}/brands/${id}`,{
      body : {
        id_user : id_user
      }
    });
  }
}
