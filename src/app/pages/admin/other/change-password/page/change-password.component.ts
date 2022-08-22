import { Component, HostListener, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import {MessageService} from 'primeng/api';
import { User } from '@models/interfaces';
import { TokenService } from 'src/app/auth/service/token.service';
import { ValidationsService } from 'src/app/shared/services/validations/validations.service';
import { ChangePasswordService } from '../service/change-password.service';

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
    private changePasswordService : ChangePasswordService,
    private _token : TokenService,
    private messageService: MessageService,
    private validationsService : ValidationsService
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
    this.user = this._token.getTokenDataUser();
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
    if(!this.passwordCurrent || !this.password || !this.passwordConfirm) return false;
    return true;
  }

  validatePassword(){
    const opc = {
      id_user : this.user.id_user,
      password : this.passwordCurrent,
    }

    this.isLoading = true;
    this.isShow = true;

    this.validationsService.validatePassword(opc).subscribe((response)=>{
      if(response.message == "Coincide"){
        this.changePasswordUser();
      }else  if(response.message == "No Coincide"){
        this.isShow = false;
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Contraseña actual no coincide', life:3000});
        return;
      }
    }, err =>{
      this.messageService.add({severity:'error', summary:'Error', detail:`Ha ocurrido un error en el servidor`});
    });
  }

  changePasswordUser(){
    const opc = {
      password : this.password
    }

    this.changePasswordService.changePasswordProfileEmployee(opc, this.user.id_user!).subscribe((response)=>{
      if(response.message == "Contraseña actualizado exitosamente"){
        this.isLoading = false;
      }else if(response.message == "Ocurrio un error interno en el servidor"){
        this.isShow = false;
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Error al actualizar contraseña', life:3000});
        return;
      }
    }, err =>{
      this.messageService.add({severity:'error', summary:'Error', detail:`Ha ocurrido un error en el servidor`});
    });
  }

  validateLengthPassword(): boolean{
    if(this.password.length < 9 || this.passwordConfirm.length < 9) return false;
    return true;
  }

  validateMatchPassword(): boolean{
    if(this.password != this.passwordConfirm) return false;
    return true;
  }

  @HostListener('document:keydown', ['$event']) onHover(event: KeyboardEvent){
    if(event.key != "Enter") return;
    this.changePassword();
  }
}
