import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  data : any = environment.dataRol;
  
  constructor(private _token : TokenService, private _router : Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      if(this._token.getToken()){
        const  rol = (JSON.parse(this._token.getTokenDataUser()!)).id_role;
        if(route.data.role != rol){
          this._router.navigate([this.data[rol]]);
          return false;
        }
        return false;
      }

    return true;
  }
  
}
