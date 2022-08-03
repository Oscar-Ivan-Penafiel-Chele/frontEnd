import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IManageIVA } from '@models/interfaces';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ManageIvaService {
  manageIva : IManageIVA = {} as IManageIVA;
  url : string = environment.API;

  constructor(private _http : HttpClient) { }

  getManageIva() : Observable<IManageIVA>{
    return this._http.get<IManageIVA>(`${this.url}/iva`);
  }

  updateIva(iva : IManageIVA) : Observable<any>{
    return this._http.put<any>(`${this.url}/iva/${iva.id_iva}`, iva);
  }

}

