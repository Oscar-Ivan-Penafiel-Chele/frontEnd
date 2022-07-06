import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Address, User } from 'src/app/models/user';
import { AddressUserService } from 'src/app/services/address-user.service';
import { HomeService } from 'src/app/services/home.service';
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
  selectAddress : any ;

  constructor(
    private _navigator : Router,
    private _token : TokenService,
    private addressService : AddressUserService,
  ) { }

  ngOnInit(): void {
    this.getDataProfile();
    this.getAddress();
  }

  getDataProfile(){
    this.user = JSON.parse(this._token.getTokenDataUser()!);
  }

  validateData(){
    this.user.user_address = this.selectAddress;
    if (this.user.user_name && this.user.user_lastName && this.user.user_document && this.user.user_address && this.user.user_address_reference && this.user.user_address_reference.length > 5 && this.user.user_phone) {
      localStorage.setItem('information_sending',JSON.stringify(this.user));
      this.nextPage();
    }

    this.submitted = true;
  }

  nextPage() {
    this._navigator.navigate(['checkout/order/payment']);
  }
  
  getAddress(){
    this.addressService.getAddress(this.user.id_user!).subscribe((response : any)=>{
      this.optionsAddress = response;
      console.log(response)
    })
  }
}
