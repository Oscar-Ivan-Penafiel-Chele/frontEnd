import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ingreso } from '@models/interfaces';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class IngresosService {

  url : string = environment.API;

  constructor(private _http : HttpClient) { }

  getIngresos() : Observable<Ingreso[]>{
    return this._http.get<Ingreso[]>(`${this.url}/inventories/ingreso`);
  }
}
