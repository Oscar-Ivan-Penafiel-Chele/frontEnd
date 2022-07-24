import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '@models/interfaces';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  url : string = environment.API;
  
  constructor(private _http : HttpClient) { }

  createClient(user : User) : Observable<any>{
    return this._http.post<any>(`${this.url}/register`,user);
  }
}
