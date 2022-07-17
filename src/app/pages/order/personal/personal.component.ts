import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Address, User } from 'src/app/models/user';
import { AddressUserService } from 'src/app/services/address-user.service';
import { RestService } from 'src/app/services/rest.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {

  submitted : boolean = false;
  user : User = {} as User;
  regexLetterSpace : RegExp = /[ a-zA-ZñÑáéíóúÁÉÍÓÚ]+$/;  
  optionsAddress : Address[] = [];
  urlImage : string  = "../../../assets/flags/ecuador.png";
  phoneUser : string = "";
  phoneAux : string = "";
  messageError : string = "";
  messageErrorPhone : string = "";
  idAddressSelected : number| undefined;

  constructor(
    private _navigator : Router,
    private _token : TokenService,
    private addressService : AddressUserService,
    private restService : RestService
  ) { }

  ngOnInit(): void {
    this.getDataProfile();
    this.getAddress();
  }

  getDataProfile(){
    this.user = JSON.parse(this._token.getTokenDataUser()!);
    this.phoneUser = this.user.user_phone!.split(")")[1];
    this.phoneAux = this.phoneUser;
  }

  validateData(){
    this.submitted = true;

    if(this.phoneUser.replace(/\s+/g, '') == this.phoneAux){ 
      this.user.user_phone = `(+593) ${this.phoneUser}`
    }else{
      this.user.user_phone = `(+593) ${this.phoneUser.replace(/\s+/g, '')}`
      this.restService.updateEmployee(this.user);
    }

    if (this.user.user_name && this.user.user_lastName && this.user.user_document && this.idAddressSelected && this.user.user_address_reference && this.user.user_address_reference.length > 5 && this.phoneUser.length == 11) {
      localStorage.setItem('information_sending',JSON.stringify(this.user));
      localStorage.setItem('information_address',JSON.stringify(this.idAddressSelected));
      localStorage.setItem('user', JSON.stringify(this.user))
      this.nextPage();
      return ;
    }

    return ;
  }

  nextPage() {
    this._navigator.navigate(['checkout/order/payment']);
  }
  
  getAddress(){
    this.addressService.getAddress(this.user.id_user!).subscribe((response : any)=>{
      this.optionsAddress = this.addressService.sortAddress(response);
    })
  }

}
