import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message, MessageService, PrimeNGConfig } from 'primeng/api';
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


  constructor(
    private primengConfig: PrimeNGConfig, 
    private _authService:AuthService,
    private _router : Router,
    private _token : TokenService,
    private _authState : AuthStateService,
    ) { 
        this.data = {};
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
      }, (error) =>{
        this.error = error.error;
        console.log("Error del login: "+error);
      }, () =>{
        this._authState.setAuthState(true);
        this.data = {};
        this._router.navigate(['dashboard-employee']);
      });
    }
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
