import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class ForgetPasswordService {
  url : string = environment.API;
  secretKey: string = environment.secretKey;

  constructor(private http : HttpClient) { }

  sendEmail(data: any): Observable<any>{
    return this.http.post<any>(`${this.url}/recover/password`,data);
  }

  encryptId(id: number){
    let idEncrypted = CryptoJS.AES.encrypt(id.toString(), this.secretKey).toString();

    return idEncrypted;
  }

  decryptedId(id: string){
    if(!id) return;

    let bytes  = CryptoJS.AES.decrypt(id, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
