import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class RecoveryPasswordService {
  url : string = environment.API;

  constructor(private http : HttpClient) { }

  changePassword(password : any, id_user : number) : Observable<any>{
    return this.http.put<any>(`${this.url}/users/password/${id_user}`, password);
  }
}
