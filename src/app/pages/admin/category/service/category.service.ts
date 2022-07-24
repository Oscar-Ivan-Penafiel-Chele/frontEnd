import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '@models/interfaces';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  url : string = environment.API;
  
  constructor(private _http : HttpClient) { }

  getCategories() : Observable<Category[]>{
    return this._http.get<Category[]>(`${this.url}/categories`);
  }
  createCategory(data : FormData) : Observable<any>{
    return this._http.post<any>(`${this.url}/categories`,data);
  }
  updateCategory(data : FormData, id: number) : Observable<any>{
    data.append('_method','PUT');
    let headers: HttpHeaders = new HttpHeaders({
      'X-Requested-With': 'XMLHttpRequest'
    });
    return this._http.post(`${this.url}/categories/${id}`,data,{headers: headers});
  }
  deleteCategory(id : number, id_user : number) : Observable<any>{ 
    // return this._http.delete(`${this.url}/categories/${id}`);
    return this._http.request('DELETE',`${this.url}/categories/${id}`,{
      body : {
        id_user : id_user
      }
    });
  }
}
