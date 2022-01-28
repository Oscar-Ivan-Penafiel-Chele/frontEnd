import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product';



@Injectable({
  providedIn: 'root'
})
export class ProductService {

    constructor(private _http : HttpClient) { }

    getProducts() {
        return this._http.get<any>('assets/data/products.json')
        .toPromise()
        .then(res => <Product[]>res.data)
        .then(data => { return data; });
    }
}
