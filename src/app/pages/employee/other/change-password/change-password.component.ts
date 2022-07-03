import { Component, Host, HostListener, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { RestService } from 'src/app/services/rest.service';
import { TokenService } from 'src/app/services/token.service';
import {MessageService} from 'primeng/api';
import { User } from 'src/app/models/user';
import { OtherComponent } from '../other.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  providers : [MessageService]
})
export class ChangePasswordComponent implements OnInit {

  passwordCurrent : string = "";
  password : string = "";
  passwordConfirm : string = "";
  submitted : boolean = false;
  user : User = {};
  roleUser : string = "";
  isVisibleText : boolean;
  loading : boolean = false;
  isLoading : boolean = false;
  isShow : boolean = false;
  
  constructor(
    private primengConfig: PrimeNGConfig,
    private _rest : RestService,
    private _token : TokenService,
    private messageService: MessageService,
  ) { 
    this.isVisibleText = true;
  }

  ngOnInit(): void {
    this.primengConfig.setTranslation({
      weak : 'Débil',
      medium : 'Bueno',
      strong : 'Excelente',
      passwordPrompt : '',
    });
    this.getDataProfile();
    this.passwordCurrent = "";
    this.password = "";
    this.passwordConfirm = "";
  }

  getDataProfile(){
    const data = this._token.getTokenDataUser() as string;
    this.user = JSON.parse(data);
    this.getRoleUser(this.user.id_role!);
  }

  getRoleUser(id_role : number){
    const roles : any= {
      1 : 'Gerente',
      2 : 'Administrador',
      3 : 'Contable',
      4 : 'Vendedor'
    }

    this.roleUser = roles[id_role];
  }

  changePassword(){
    this.submitted = true;
    if(!this.validateInput()) return ;
    
    this.validatePassword();
  }

  validateInput(){
    if(!this.passwordCurrent || !this.password || this.password.length < 8 || !this.passwordConfirm || this.passwordConfirm.length < 8) return false;
  
    return true;
  }

  validatePassword(){
    const opc = {
      id_user : this.user.id_user,
      password : this.passwordCurrent,
    }

    this.isLoading = true;
    this.isShow = true;

    this._rest.validatePassword(opc).subscribe((response)=>{
      if(response.status == 200 && response.message === "Coincide"){
        this.changePasswordUser();
      }else  if(response.status == 200 && response.message === "No Coincide"){
        this.isShow = false;
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Contraseña actual no coincide', life:3000});
        return;
      }
    });
  }

  changePasswordUser(){
    const opc = {
      password : this.password
    }

    this._rest.changePasswordProfileEmployee(opc, this.user.id_user!).subscribe((response)=>{
      if(response.status == 200 || response.message === "Contraseña actualizado exitosamente"){
        this.isLoading = false;
      }else if(response.status == 500 || response.message === "Ocurrio un error interno en el servidor"){
        this.isShow = false;
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Error al actualizar contraseña', life:3000});
        return;
      }
    });
  }

  @HostListener('document:keydown', ['$event']) onHover(event: KeyboardEvent){
    if(event.key != "Enter") return;
    this.changePassword();
  }
}
