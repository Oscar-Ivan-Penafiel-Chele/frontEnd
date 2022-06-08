import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from 'src/app/services/token.service';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate {

  data : any = environment.dataRol;
  
  constructor(private _token : TokenService, private _router : Router){}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      // --> En caso de querer acceder a una ruta no autorizada con su rol
      // --> se redirige al home de cada rol
      if(this._token.getToken()){
        const  rol = (JSON.parse(this._token.getTokenDataUser()!)).id_role;

        if(route.data.role != rol){
          this._router.navigate([this.data[rol]]); 
          return false;
        }
      }

    return true;
  }
  
}
