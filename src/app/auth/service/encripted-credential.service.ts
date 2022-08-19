import { Injectable } from '@angular/core';
import { User } from '@models/interfaces';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncriptedCredentialService {
  secretKey: string = "YourSecretKeyForEncryption&Descryption";

  constructor() { }

  encrypt(data: User) : string{
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey).toString();
  }

  decrypt(data : string){
    if(data){
      let textToDecrypt = data.replaceAll('"', '');
      let bytes  = CryptoJS.AES.decrypt(textToDecrypt, this.secretKey);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }

    return;
  }
}
