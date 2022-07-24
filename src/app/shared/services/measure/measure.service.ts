import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Measure } from '@models/interfaces';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MeasureService {
  url : string = environment.API;

  constructor(private _http : HttpClient) { }

  getMeasure() : Observable<Measure[]>{
    return this._http.get<Measure[]>(`${this.url}/units`);
  }
}
