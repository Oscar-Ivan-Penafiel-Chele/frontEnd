import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Brand } from '../models/brand';
import { Category } from '../models/category';
import { NavigationItem } from '../models/navigation';
import { Product } from '../models/product';

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
