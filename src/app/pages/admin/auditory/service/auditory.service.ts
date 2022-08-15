import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auditory } from '@models/interfaces';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuditoryService {
  url : string = environment.API;
  
  constructor(private _http : HttpClient) { }

  getAuditories() : Observable<Auditory[]>{
    return this._http.get<Auditory[]>(`${this.url}/audit`);
  }
}
