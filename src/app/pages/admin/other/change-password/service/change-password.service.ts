import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  url : string = environment.API;

  constructor(private _http : HttpClient) { }

  changePasswordProfileEmployee(password : any, id_user : number) : Observable<any>{
    return this._http.put<any>(`${this.url}/users/password/${id_user}`, password);
  }
}
