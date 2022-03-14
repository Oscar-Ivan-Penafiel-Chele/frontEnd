import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Brand } from '../models/brand';
import { Category } from '../models/category';
import { NavigationItem } from '../models/navigation';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  product : Product = {} as Product;
  
  private sendProductSubject = new Subject<Product>();
  sendProductObservable = this.sendProductSubject.asObservable();

  constructor(private _http : HttpClient) { }

  pathItemNavigation : string = "assets/data/itemNavigation.json";

  getAllItemNavigation() : Observable<NavigationItem[]>{
    return this._http.get<NavigationItem[]>(this.pathItemNavigation);
  }

  sendProduct(product : Product){
    // this.product = product;
    // this.sendProductSubject.next(product);

  }

  setProduct(product : Product){
    this.product = product;
  }

  getProduct(){
    return this.product;
  }
}
