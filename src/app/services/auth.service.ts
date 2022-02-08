import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  API : string = "http://localhost:8000/api";

  constructor(private _http : HttpClient) { }

  /* USER */
  login(data : {}) : Observable<any>{
    return this._http.post<any>(`${this.API}/login`,data);
  }

  logout(id_User : number) : Observable<any>{
    return this._http.post<any>(`${this.API}/logout`,id_User);
  }

  register(data : User) : Observable<any>{
    return this._http.post<any>(`${this.API}/register`,data);
  }

  profileUser(data:any): Observable<User> {
    return this._http.post<User>(`${this.API}/userinfo`,data);
  }
}
