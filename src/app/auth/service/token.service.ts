import { Injectable } from '@angular/core';
import { EncriptedCredentialService } from './encripted-credential.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private issuer = {
    login: 'http://127.0.0.1:8000/api/auth/login',
    register: 'http://127.0.0.1:8000/api/auth/register'
  }

  constructor(private encriptedService: EncriptedCredentialService) { }

  handleData(token : any){
    localStorage.setItem('auth_token',token);

  }

  getToken(){
    return localStorage.getItem('auth_token');
  }

  getTokenDataUser(){
    let user = localStorage.getItem('user');
    let data = this.encriptedService.decrypt(user!);

    return data;
  }

  removeToken(){
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }
  

  // isValidToken(){
  //   const token =  this.getToken();
  //   if(token){
  //     const payload = this.payload(token);
  //     if(payload){
  //       return Object.values(this.issuer).indexOf(payload.iss) > -1 ? true : false;
  //     }else{
  //       return false;
  //     }
  //   }else{
  //     return false;
  //   }
  // }

  // payload(token : any){
  //   const jwtPayload = token.split('.')[1];
  //   return JSON.parse(atob(jwtPayload));
  // }  

  // isLoggedIn(){
  //   return this.isValidToken();
  // }

  
}
