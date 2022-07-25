import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IContact } from '@models/interfaces';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  url : string = environment.API;
  
  constructor(private http : HttpClient) { }

  sendComment(data : IContact) : Observable<any>{
    return this.http.post<any>(`${this.url}/contact`, data);  
  }
}
