import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MigrationService {
  url : string = environment.API;
  
  constructor(private _http : HttpClient) { }

  uploadStock(data : FormData) : Observable<any>{
    return this._http.post<any>(`${this.url}/products/upload/excel`,data);
  }
}
