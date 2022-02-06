import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message, MessageService, PrimeNGConfig } from 'primeng/api';
import { User } from 'src/app/models/user';
import { AuthStateService } from 'src/app/services/auth-state.service';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

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
  data:{};
  error: any = null;
  loading : boolean = false;
  isVisibleText : boolean;
  user : User = {};

  constructor(
    private primengConfig: PrimeNGConfig, 
    private _authService:AuthService,
    private _router : Router,
    private _token : TokenService,
    private _authState : AuthStateService,
    ) { 
        this.data = {};
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
  }

  login(){
    this.loading = true;
    this.isVisibleText = false;
    if(!this.validateInput()){
      let msg = "Datos incompletos!";
      this.alertMessage(msg);
    }else{
      this.data = {
        'email': this.email,
        'password': this.password
      }
      this._authService.login(this.data)
      .subscribe((response) => {
          this.responseHandle(response);
          this.redirectRoute();
      }, (error) =>{
        this.error = error.error;
        console.log("Error del login: "+error);
      });
    }
  }

  async redirectRoute(){
    await this.setProfileUser();
    this.getProfileUser().then((r)=>{
      this.user = JSON.parse(r);
      this.getRoute(this.user.id_role);
    }, (error) =>{
      console.log(error.error);
    });
  }

  async setProfileUser(){
    this._authService.profileUser(this._token.getToken())
    .subscribe((response) =>{
      localStorage.setItem('user', JSON.stringify(response));
    });
  }

  async getProfileUser(){
    return this._token.getTokenDataUser() as string;
  }

  getRoute(rol? : number){
    
  }

  responseHandle(data : any){
    this._token.handleData(data.access_token);
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
