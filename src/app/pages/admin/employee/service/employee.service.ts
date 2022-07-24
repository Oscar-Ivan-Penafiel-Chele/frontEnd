import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '@models/interfaces';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  url : string = environment.API;
  
  constructor(private _http : HttpClient) { }

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
}
