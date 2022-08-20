import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ForgetPasswordService {
  url : string = environment.API;
  
  constructor(private http : HttpClient) { }
  
  sendEmail(data: any): Observable<any>{
    return this.http.post<any>(`${this.url}/recover/password`,data);
  }
}
