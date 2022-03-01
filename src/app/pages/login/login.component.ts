import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message, MessageService, PrimeNGConfig } from 'primeng/api';
import { User } from 'src/app/models/user';
import { AuthStateService } from 'src/app/services/auth-state.service';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers : [MessageService]
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
  submitted: boolean = false;
  invalidCredentials : boolean = false;
  isValidCredentials : boolean = false;

  constructor(
    private primengConfig: PrimeNGConfig, 
    private _authService:AuthService,
    private _router : Router,
    private _token : TokenService,
    private _authState : AuthStateService,
    private messageService: MessageService,
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

  pressButton(e : any){
    if(e.keyCode === 13 && !e.shiftKey){
      const btn = document.getElementById('btnLogin');
      btn?.click();
    }
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
        if(response.status == 401 || response.message == "Credenciales Invalidas"){
          this.invalidCredentials = true;
          setTimeout(()=>{
            this.invalidCredentials = false;
          },3000);
          this.loading = false;
          this.isVisibleText = true;
          return ;
        }
        this.isValidCredentials = true;
        this.responseHandle(response);
        this.redirectRoute();
    }, (error) =>{
      this.error = error.error;
      console.log("Error del login: "+error);
    });
  }

  async redirectRoute(){
    await this.setProfileUser();
  }

  async setProfileUser(){
    this._authService.profileUser(this._token.getToken())
    .subscribe((response) =>{
      localStorage.setItem('user', JSON.stringify(response));
       this.getProfileUser().then((r)=>{
          this.user = JSON.parse(r);
          this.getRoute(this.user.id_role!);
       });
    });
  }

  async getProfileUser(){
    return this._token.getTokenDataUser() as string;
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
}
