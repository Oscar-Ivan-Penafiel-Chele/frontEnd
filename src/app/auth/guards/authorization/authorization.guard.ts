import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { EncriptedCredentialService } from '../../service/encripted-credential.service';
import { TokenService } from '../../service/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate {

  data : any = environment.dataRol;
  
  constructor(private _token : TokenService, private _router : Router, private encryptedService: EncriptedCredentialService){}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      // --> En caso de querer acceder a una ruta no autorizada con su rol
      // --> se redirige al home de cada rol
      if(this._token.getToken()){
        const encrypt = localStorage.getItem('user');
        const user = this.encryptedService.decrypt(encrypt!);

        const  rol = user.id_role;

        if(route.data.role != rol){
          this._router.navigate([this.data[rol]]); 
          return false;
        }
      }

    return true;
  }
  
}
