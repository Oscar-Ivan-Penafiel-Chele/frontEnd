import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message, MessageService, PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [MessageService]
})
export class SignupComponent implements OnInit {
  name:string = "";
  lastName:string = "";
  email:string = "";
  cedula : string = "";
  password:string = "";
  passwordConfirm:string = "";
  checked:boolean= false;
  msgs1: Message[] = [];

  constructor(private primengConfig: PrimeNGConfig, private _router : Router) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.primengConfig.setTranslation({
      weak : 'Débil',
      medium : 'Bueno',
      strong : 'Excelente',
      passwordPrompt : '',
    });
  }

  registerUser(){
    let msg;
    if(!this.checkData(this.name,this.lastName,this.email,this.cedula,this.password,this.passwordConfirm)){
      msg = "Datos incompletos!"
      this.messageAlert(msg);
    }else{
      if(!this.regexData(this.name,this.lastName,this.email)){
        msg = "Ingresar un email correcto!"
        this.messageAlert(msg);
      }else{
        if(!this.checked){
          msg = "Aceptar términos y condiciones!"
          this.messageAlert(msg);
        }else{
          if(this.password.localeCompare(this.passwordConfirm) != 0){
            msg = "Las contraseñas no coinciden!"
            this.messageAlert(msg);
          }else{
            msg = "Datos ingresados correctamente!"
            this.messageAlert(msg);
            // this._router.navigate(['login']);
          }
        }
      } 
    }
  }

  checkData(name : string,lastName : string, email : string, cedula : string, password : string, passwordConfirm : string){
    if( name.length < 2 || lastName.length < 2 || email.length < 5 || cedula.length < 3 || password.length < 8 || passwordConfirm.length < 8 ){
      return false;
    }else{
      return true;
    }
  }  

  regexData(name : string, lastName : string, email : string){
    let regexText = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
    let regexEmail = /^[\w]+@{1}[\w]+\.+[a-z]{2,3}$/

    let responseName = regexText.test(name);
    let responseLastName = regexText.test(lastName);
    let responseEmail = regexEmail.test(email);

    if(!responseName || !responseLastName || !responseEmail){
      return false;
    }else{
      return true;
    }
  }

  regexCedula(event: any) {
    let pattern = /^[0-9]*$/;   
    
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^0-9]/g, "");
    }
  }

  messageAlert(msg : string){
    this.msgs1 = [
      {severity:'info', summary:'Info: ', detail: msg},
    ];
    
    setTimeout(()=>{
      this.msgs1 = []
    },5000);
  }
}
