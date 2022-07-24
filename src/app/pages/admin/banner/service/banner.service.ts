import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Banner } from '@models/interfaces';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  url : string = environment.API;
  constructor(private _http : HttpClient) { }

  getBanners() : Observable<Banner[]>{
    return this._http.get<Banner[]>(`${this.url}/banners`);
  }
  createBanner(data : FormData) : Observable<any>{
    return this._http.post<any>(`${this.url}/banners`, data);
  }
  updateBanner(data : FormData, id_banner : number) : Observable<any>{
    data.append('_method','PUT');
    return this._http.post<any>(`${this.url}/banners/${id_banner}`,data,);
  }
  deleteBanner(id_banner : number, id_user : number) : Observable<any>{
    return this._http.request('DELETE',`${this.url}/banners/${id_banner}`,{
      body : {
        id_user : id_user
      }
    });
  }
  
}
