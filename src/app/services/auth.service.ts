import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url : string = environment.API;

  constructor(private _http : HttpClient) { }

  /* USER */
  login(data : {}) : Observable<any>{
    return this._http.post<any>(`${this.url}/login`,data);
  }

  logout(id_User : number) : Observable<any>{
    return this._http.post<any>(`${this.url}/logout/${id_User}`,"");
  }

  register(data : User) : Observable<any>{
    return this._http.post<any>(`${this.url}/register`,data);
  }

  profileUser(data:any): Observable<User> {
    return this._http.post<User>(`${this.url}/userinfo`,data);
  }
}
