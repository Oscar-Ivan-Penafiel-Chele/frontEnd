import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  passwordCurrent : string = "";
  password : string = "";
  passwordConfirm : string = "";
  submitted : boolean = false;
  
  constructor(
    private primengConfig: PrimeNGConfig,
  ) { }

  ngOnInit(): void {
    this.primengConfig.setTranslation({
      weak : 'Débil',
      medium : 'Bueno',
      strong : 'Excelente',
      passwordPrompt : '',
    });
  }

  changePassword(){
    this.submitted = true;

    if(!this.validateInput()) return ;
    //peticion
  }

  validateInput(){
    if(!this.passwordCurrent || !this.password || this.password.length < 9 || !this.passwordConfirm || this.passwordConfirm.length < 9) return false;
  
    return true;
  }

}
