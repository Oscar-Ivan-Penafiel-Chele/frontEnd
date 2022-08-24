import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/auth/service/token.service';
import { Address, User } from '@models/interfaces';
import { EmployeeService } from 'src/app/pages/admin/employee/service/employee.service';
import { AddressUserService } from 'src/app/pages/admin/other/address/service/address-user.service';
import { EncriptedCredentialService } from 'src/app/auth/service/encripted-credential.service';

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
  typeDocument : string = "";
  idAddressSelected : number| undefined;

  constructor(
    private _navigator : Router,
    private _token : TokenService,
    private addressService : AddressUserService,
    private employeeService : EmployeeService,
    private encriptedCredentials : EncriptedCredentialService
  ) { }

  ngOnInit(): void {
    this.getDataProfile();
    this.getAddress();
  }

  getDataProfile(){
    this.user = this._token.getTokenDataUser();
    this.phoneUser = this.user.user_phone!.split(")")[1];
    this.phoneAux = this.phoneUser;

    this.getTypeDocument(this.user.id_identification_type!);
  }

  getTypeDocument(idTypeDocument : number){
    switch (idTypeDocument) {
      case 1: this.typeDocument = "Cédula"
        break;
      case 2: this.typeDocument = "Pasaporte"
        break;
      case 3: this.typeDocument = "RUC"
        break;
      default:
        break;
    }
  }


  validateData(){
    this.submitted = true;

    if(this.phoneUser.replace(/\s+/g, '') == this.phoneAux){ 
      this.user.user_phone = `(+593)${this.phoneUser}`
    }else{
      this.user.user_phone = `(+593)${this.phoneUser.replace(/\s+/g, '')}`
      this.employeeService.updateEmployee(this.user).subscribe((r : any) => r);
    }

    if (this.user.user_name && this.user.user_lastName && this.user.user_document && this.idAddressSelected && this.user.user_address_reference && this.user.user_address_reference.length > 5 && this.phoneUser.length == 11) {
      localStorage.setItem('information_address',JSON.stringify(this.idAddressSelected));

      let encrypt = this.encriptedCredentials.encrypt(this.user);
      this._token.setTokenUser(encrypt);

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
