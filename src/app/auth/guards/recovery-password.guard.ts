import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ForgetPasswordService } from 'src/app/pages/forget-password/service/forget-password.service';
import { ValidationsService } from 'src/app/shared/services/validations/validations.service';

@Injectable({
  providedIn: 'root'
})
export class RecoveryPasswordGuard implements CanActivate {
  isChange: boolean = true;

  constructor(
    private router: Router,
    private _route: ActivatedRoute,
    private validationsService: ValidationsService,
    private forgetPassword: ForgetPasswordService
    ){
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      let url = state.url;
      let index = url.lastIndexOf('/');
      let idEncrypted = url.substring(index + 1)

      let id = this.forgetPassword.decryptedId(idEncrypted);

      this.validationsService.validateRequestChangePassword(parseInt(id!)).subscribe((response: any)=>{
        if(response.message == "no existe") {
          this.isChange = false;
          this.router.navigate(['login']);
        }else{
          this.isChange = true;
        }
      })

      return this.isChange;
  }
}
