import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuditoryService {
  url : string = environment.API;
  
  constructor(private _http : HttpClient) { }

  getAuditories() : Observable<any>{
    return this._http.get<any>(`${this.url}/audit`);
  }
}
