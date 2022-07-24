import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sail } from '@models/interfaces';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ReportSailService {

  url : string = environment.API;

  constructor(private _http : HttpClient) { }

  getSails() : Observable<Sail[]>{
    return this._http.get<Sail[]>(`${this.url}/inventories/egreso`);
  }

}
