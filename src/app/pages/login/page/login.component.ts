import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message, MessageService, PrimeNGConfig } from 'primeng/api';
import { AuthService } from 'src/app/auth/service/auth.service';
import { TokenService } from 'src/app/auth/service/token.service';
import { User } from '@models/interfaces';
import * as crypto from 'crypto-js';


import { environment } from 'src/environments/environment.prod';
import { EncriptedCredentialService } from 'src/app/auth/service/encripted-credential.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers : [MessageService]
})
export class LoginComponent implements OnInit {
  email : string = "";
  password : string = "";
  keepSession : boolean = true;

  msgs1: Message[] = [];
  data:{};
  error: any = null;
  loading : boolean = false;
  isVisibleText : boolean;
  user : User = {};
  submitted: boolean = false;
  selectedMessageStatus : any;
  optionsMessageStatus : any;
  displayMessage : boolean = false;

  constructor(
    private primengConfig: PrimeNGConfig,
    private _authService:AuthService,
    private _router : Router,
    private _token : TokenService,
    private encriptedCredentials : EncriptedCredentialService
    ) {
        this.data = {};
        this.isVisibleText = true;
        this.optionsMessageStatus = {
          'invalido' : { severity : 'error', message : "Credenciales No Válidas"},
          'valido' : {severity : 'success', message : "Credenciales Válidas"},
          'bloqueado' : {severity : 'error', message : "Demasiados intentos, intentalo más tarde"},
          'error' : {severity : 'error', message : "Error del servidor, intentalo más tarde"}
        };
    }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.primengConfig.setTranslation({
      weak : 'Débil',
      medium : 'Bueno',
      strong : 'Excelente',
      passwordPrompt : '',
    });
    //this.pressEnter();
  }

  login(){
    this.submitted = true;
    if(!this.validateInput()){
      this.loading=false;
      return ;
    }else{
      this.requestLogin();
    }
  }

  requestLogin(){
    this.loading = true;
    this.isVisibleText = false;
    this.data = {
      'email': this.email,
      'password': this.password
    }

    this._authService.login(this.data)
    .subscribe((response) => {
        this.displayMessage = true;
        if(response.status == 401 && response.message == "Credenciales Invalidas"){
          this.selectedMessageStatus = this.optionsMessageStatus['invalido'];
          this.closeMessage();
          return ;
        }else if(response.status == 500 && response.message == "Ocurrio un error interno en el servidor"){
          this.selectedMessageStatus = this.optionsMessageStatus['error'];
          this.closeMessage();
          return ;
        }else if(response.status == 500 || response.message == "Demasiados intentos, intentar en 1 minuto"){
          this.selectedMessageStatus = this.optionsMessageStatus['bloqueado'];
          this.closeMessage();
          return ;
        }

        this.selectedMessageStatus = this.optionsMessageStatus['valido'];
        this.responseHandle(response);
        this.redirectRoute();
    },err =>{
      this.displayMessage = true;
      if(err.status == 500){
        this.selectedMessageStatus = this.optionsMessageStatus['error'];
        this.closeMessage();
      }
    });
  }

  closeMessage(){
    setTimeout(()=>{
      this.displayMessage = false;
    },3000);
    this.loading = false;
    this.isVisibleText = true;
  }

  async redirectRoute(){
    await this.setProfileUser();
  }

  async setProfileUser(){
    this._authService.profileUser(this._token.getToken()).subscribe((response) =>{
      let encrypt = this.encriptedCredentials.encrypt(response);
      this._token.setTokenUser(encrypt);
      this._token.setKeepSession(this.keepSession);

      this.user = this._token.getTokenDataUser();
      this.getRoute(this.user.id_role!);
    });
  }

  getRoute(rol : number){
    const roles : any = environment.dataRol;

    let route = roles[rol];
    this._router.navigate([`${route}`]);
  }

  responseHandle(data : any){
    this._token.handleData(data.access_token);
  }

  validateInput(){
    if(this.email === '' || this.password === ''){
      return false;
    }else{
      return true;
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

  @HostListener('document:keydown', ['$event']) onHover(event: KeyboardEvent){
    if(event.key != "Enter") return;
    this.login();
  }
}
