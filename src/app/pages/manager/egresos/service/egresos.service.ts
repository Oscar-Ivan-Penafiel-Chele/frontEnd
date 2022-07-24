import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EgresoAux } from '@models/interfaces';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class EgresosService {
  url : string = environment.API;
  
  constructor(private _http : HttpClient) { }

  getEgresos() : Observable<any>{
    return this._http.get<any>(`${this.url}/inventories/egreso`);
  }
  createEgreso(data : EgresoAux) : Observable<any>{
    return this._http.post<any>(`${this.url}/inventories/egreso`,data);
  }
}
