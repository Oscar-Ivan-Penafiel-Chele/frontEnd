import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NavigationItem } from '@models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private _http : HttpClient) { }

  pathItemNavigation : string = "assets/data/itemNavigation.json";

  getAllItemNavigation() : Observable<NavigationItem[]>{
    return this._http.get<NavigationItem[]>(this.pathItemNavigation);
  }
}
