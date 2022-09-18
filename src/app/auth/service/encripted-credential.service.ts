import { Injectable } from '@angular/core';
import { User } from '@models/interfaces';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class EncriptedCredentialService {
  secretKey: string = environment.secretKey;

  constructor() { }

  encrypt(data: User) : string{
    let text = CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey).toString();
    let encrypt = text.replaceAll('"', '');

    return encrypt;
  }

  decrypt(data : string){
    if(data){
      let bytes  = CryptoJS.AES.decrypt(data, this.secretKey);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }

    return;
  }
}
