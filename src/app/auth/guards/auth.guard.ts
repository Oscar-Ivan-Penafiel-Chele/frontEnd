import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { TokenService } from '../service/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  data : any = environment.dataRol;

  constructor(private _rest : TokenService, private _router : Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if(!this._rest.getToken()){
      this._router.navigate(['login']);
      return false;
    }else{
      const  rol = (JSON.parse(this._rest.getTokenDataUser()!)).id_role;
      if(rol != 5){
        this._router.navigate([this.data[rol]]);
        return false;
      }

      return true;
    }
  }
  
}
