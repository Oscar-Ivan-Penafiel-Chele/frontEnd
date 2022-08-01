import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { Promotion } from '@models/interfaces';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  url : string = environment.API;

  constructor(private _http : HttpClient) { }

  getPromotions() : Observable<Promotion[]>{
    return this._http.get<Promotion[]>(`${this.url}/promotions`);
  }
  createPromotion(promotion : Promotion) :Observable<any>{
    return this._http.post<any>(`${this.url}/promotions`,promotion);
  }
  updatePromotion(promotion : Promotion) : Observable<any>{
    return this._http.put<any>(`${this.url}/promotions/${promotion.id_promotion}`,promotion);
  }
  deletePromotion(id_promotion : number, id_user:number) : Observable<any>{
    return this._http.request('DELETE',`${this.url}/promotions/${id_promotion}`,{
      body : {
        id_user : id_user
      }
    });
  }
}
