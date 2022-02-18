import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message, MessageService, PrimeNGConfig } from 'primeng/api';
import { User } from 'src/app/models/user';
import { RestService } from 'src/app/services/rest.service';
import { verificarRuc } from 'udv-ec';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [MessageService]
})
export class SignupComponent implements OnInit {
  user : User = {} as User;
  passwordConfirm:string = "";
  checked:boolean= false;
  msgs1: Message[] = [];
  submitted : boolean = false;
  typeIdentification : any ;
  maxLength : number = 0;
  stateIdentification : boolean = false;
  stateEmail : boolean = false;
  messageIdentification : string = "";
  messageEmail : string = "";
  loading : boolean = false;
  isVisibleText : boolean;

  regexLetterSpace : RegExp = /[ a-zA-ZñÑáéíóúÁÉÍÓÚ]+$/;  

  constructor(private primengConfig: PrimeNGConfig, private _router : Router, private _rest : RestService) {
    this.isVisibleText = true;
   }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.primengConfig.setTranslation({
      weak : 'Débil',
      medium : 'Bueno',
      strong : 'Excelente',
      passwordPrompt : '',
    });
    this.typeIdentification = [
      {id:1, name:'Cédula', icon : 'pi pi-id-card'},
      {id:2, name:'Pasaporte', icon : 'pi pi-wallet'},
      {id:3, name:'RUC', icon : 'pi pi-book'}
    ],
    this.submitted = false;
    this.user.password ='';
  }

  registerUser(){
    this.submitted = true;
    this.user.user_phone = this.user.user_phone?.replace(/ /g, "");
    this.user.id_role = 5;

    !this.regexData(this.user.email!) ? this.messageEmail = 'Correo Electrónico inválido' : this.messageEmail = "";
    !this.validateIdentification() ? this.messageIdentification = 'Identificación inválida' : this.messageIdentification = '';
    if(!this.validatePassword()){
      this.msgs1 = [{severity:'info', summary:'Info', detail:'Contraseñas no coinciden'}];
      setTimeout(() => {
        this.msgs1 = [];
      }, 3000);
      return;
    }

    if(!this.validateData()) return ;

    this.loading = true;
    this.isVisibleText = false;

    this._rest.createClient(this.user).subscribe((response:any) =>{
      if(response.code === 200 || response.state === 'Cliente creado con exito'){
        this._router.navigate(['login']);
      }else{
       this.loading = false;
       this.isVisibleText = true;
      }
    })
  }

  changeIdentification($event : any){
    if($event.value == 1) this.maxLength = 10;
    if($event.value == 2) this.maxLength = 10;
    if($event.value == 3) this.maxLength = 20;
  }

  changeEmail($event : any){
    if($event.data == null){
      this.messageEmail = "";
    }
  }

  validateIdentification(){
    if(this.user.id_identification_type == 1) return this.validateCedula();
    if(this.user.id_identification_type == 2) return this.validatePasaporte();
    if(this.user.id_identification_type == 3) return verificarRuc(this.user.user_document!);
    
    return false;
  }

  validateCedula(){
    this.stateIdentification = true;
    let cedula = this.user.user_document!;
    let firsTwoDigits = parseInt(String(cedula?.slice(0,2)));
    let lastDigit = cedula.slice(9);
    let digits :any = cedula.slice(0,9);
    let resultPar = 0;
    let sumaPar = 0;
    let sumaImpar = 0;
    let total = 0;
    let base = 0;

    if(cedula!?.length < 10) return false;

    if((firsTwoDigits > 0 && firsTwoDigits < 25) || firsTwoDigits == 30){
      for (let i = 0; i < digits!.length; i++) {
        if(i%2 == 0) {
           resultPar = digits[i] * 2;
           if(resultPar > 9){
            resultPar = resultPar - 9;
           }
           sumaPar += resultPar;
        }else{
            sumaImpar += parseInt(digits[i]);
        }
      }

      total = sumaPar + sumaImpar;
      base = ((parseInt(String(sumaPar + sumaImpar).slice(0,1))+1)*10) - total;
      if(lastDigit === String(base)){
          return true;
      }else{
          return false;
      }
    }else{
      return false;
    }
  }

  validatePasaporte(){
    let pasaporte = parseInt(this.user.user_document!);
    if(pasaporte < 14 || pasaporte > 20){
      return false;
    } 

    return true;
  }

  validatePassword(){
    if(this.user.password != this.passwordConfirm) return false;

    return true;
  }

  validateData(){
    if(!this.user.user_name || !this.user.user_lastName || !this.user.email || !this.user.user_phone || !this.user.user_address ||!this.user.id_identification_type || !this.user.user_document || !this.user.password || !this.passwordConfirm || !this.checked){
      return false;
    }

    return true;
  }

  regexData(email : string){
    this.stateEmail = true;
    let regexEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

     return regexEmail.test(email);
  }

  regexCedula(event: any) {
    event.target.value = event.target.value.replace(/[^0-9a-zA-ZáéíñóúüÁÉÍÑÓÚÜ]/g, "");
    if(event.data == null){
      this.messageIdentification = '';
    }
  }

}
