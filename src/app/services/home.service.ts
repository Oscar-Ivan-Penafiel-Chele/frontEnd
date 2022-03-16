import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { NavigationItem } from '../models/navigation';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  userClient : User = {} ;

  constructor(private _http : HttpClient) { }

  pathItemNavigation : string = "assets/data/itemNavigation.json";

  getAllItemNavigation() : Observable<NavigationItem[]>{
    return this._http.get<NavigationItem[]>(this.pathItemNavigation);
  }

  setUser(user : User){
    this.userClient = user;
  }

  getUser(){
    return this.userClient;
  }
}
