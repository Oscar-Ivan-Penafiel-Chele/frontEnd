import { Component, OnInit } from '@angular/core';
import { Message, MessageService, PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email : string = "";
  password : string = "";
  keepSession : boolean = false;

  msgs1: Message[] = [];


  constructor(private primengConfig: PrimeNGConfig) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.primengConfig.setTranslation({
      weak : 'Débil',
      medium : 'Bueno',
      strong : 'Excelente',
      passwordPrompt : '',
    });
  }

  login(){
    if(!this.validateInput()){
      let msg = "Datos incompletos!";
      this.alertMessage(msg);
    }else{
      //verificar con servicios
    }
  }

  validateInput(){
    if(this.email.length > 0 || this.password.length > 0){
      return true;
    }else{
      return false;
    } 
  }

  alertMessage(msg : string){
    this.msgs1 = [
      {severity:'info', summary:'Info: ', detail: msg},
    ];
    setTimeout(()=>{
      this.msgs1 = []
    },3000);
  }
}
