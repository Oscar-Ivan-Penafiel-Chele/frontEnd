import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { IProvider } from '../models/provider';
import { Brand } from '../models/brand';
import { environment } from 'src/environments/environment.prod';
import { Measure } from '../models/measure';
import { Category } from '../models/category';
import { Type_Provider } from '../models/type_provider';
import { User } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class RestService {

  url : string = environment.API;

  constructor(private _http : HttpClient) { }

  /* CLIENT */
  createClient(user : User) : Observable<any>{
    return this._http.post<any>(`${this.url}/register`,user);
  }
  
  /* EMPLEADOS */
  getEmployees() : Observable<User[]>{
    return this._http.get<User[]>(`${this.url}/users`); 
  }
  createEmployee(user : User) : Observable<any>{
    return this._http.post<any>(`${this.url}/users`, user);
  }
  updateEmployee(user : User) : Observable<any>{
    return this._http.put<any>(`${this.url}/users/${user.id_user}`, user);
  }
  deleteEmployee(id : number, id_user : number) : Observable<any>{
    // return this._http.delete<any>(`${this.url}/users/${id}`);
    return this._http.request('DELETE',`${this.url}/users/${id}`,{
      body : {
        id_user : id_user
      }
    });
  }

  validatePassword(opc : any) : Observable<any>{
    return this._http.post<any>(`${this.url}/validate/user/password`, opc);
  }

  changePasswordProfileEmployee(password : any, id_user : number) : Observable<any>{
    return this._http.put<any>(`${this.url}/users/password/${id_user}`, password);
  }

  /* PRODUCTO */
  getProducts() : Observable<Product[]>{
    return this._http.get<Product[]>(`${this.url}/products`);
  }
  validateNameProduct(nameProduct : string) : Observable<any>{
    const data = {'product_name':nameProduct}
    return this._http.post<any>(`${this.url}/validate/product/name`,data);
  }
  createProduct(data : FormData): Observable<any>{
    return this._http.post<any>(`${this.url}/products`,data);
  }
  updateProduct(data : FormData, id : number) : Observable<any>{
    data.append('_method','PUT');
    let headers: HttpHeaders = new HttpHeaders({
      'X-Requested-With': 'XMLHttpRequest'
    });

    return this._http.post<any>(`${this.url}/products/${id}`,data,{headers : headers});
  }

  deleteProduct(id? : number, id_user? : number) : Observable<any>{
    // return this._http.delete<any>(`${this.url}/products/${id}`);
    return this._http.request('DELETE',`${this.url}/products/${id}`,{
      body : {
        id_user : id_user
      }
    });
  }

  /* CODIGO PRODUCT */
  getCodeProduct() : Observable<any>{
    return this._http.get<any>(`${this.url}/validate/product/code`);
  }
 
  /* UPLOAD STOCK */
  uploadStock(data : FormData) : Observable<any>{
    return this._http.post<any>(`${this.url}/products/upload/excel`,data);
  }

  /* PROVEEDOR */
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

  /* TYPE PROVIDER */
  getTypeProviders() : Observable<Type_Provider[]>{
    return this._http.get<Type_Provider[]>(`${this.url}/type-providers`);
  }


  /* BRAND */
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
    // return this._http.delete<any>(`${this.url}/brands/${id}`);
    return this._http.request('DELETE',`${this.url}/brands/${id}`,{
      body : {
        id_user : id_user
      }
    });
  }


  /* MEDIDAS */
  getMeasure() : Observable<Measure[]>{
    return this._http.get<Measure[]>(`${this.url}/units`);
  }


  /* CATEGORIES */
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

  /* AUDITORY */
  getAuditories() : Observable<any>{
    return this._http.get<any>(`${this.url}/audit`);
  }
}
