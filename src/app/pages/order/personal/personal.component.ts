import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
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


  constructor(
    private _navigator : Router,
    private _token : TokenService,
    private _home : HomeService
  ) { }

  ngOnInit(): void {
    this.getDataProfile();
  }

  getDataProfile(){
    this.user = JSON.parse(this._token.getTokenDataUser()!);
  }

  validateData(){
    if (this.user.user_name && this.user.user_lastName && this.user.user_document && this.user.user_address && this.user.user_address.length > 5 && this.user.user_address_reference && this.user.user_address_reference.length > 5 && this.user.user_phone) {
      localStorage.setItem('information_sending',JSON.stringify(this.user));
      this.nextPage();
    }

    this.submitted = true;
  }

  nextPage() {
    this._navigator.navigate(['checkout/order/payment']);
  }
  
}
