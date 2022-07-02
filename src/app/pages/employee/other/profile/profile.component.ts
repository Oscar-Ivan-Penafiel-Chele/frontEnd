import { Component, Host, HostListener, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { RestService } from 'src/app/services/rest.service';
import { TokenService } from 'src/app/services/token.service';
import { OtherComponent } from '../other.component';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers : [MessageService]
})
export class ProfileComponent implements OnInit {

  user : User = {};
  roleUser : string = "";
  submitted : boolean = false;
  input_phone : boolean =true;
  displayModal : boolean = false;
  confirmPassword : string = "";
  completeData : boolean = false;
  overlayLogout : boolean = false;
  isVisibleText : boolean;
  loading : boolean = false;
  buttonCancel : boolean = false;
  typeDocument : string = "";
  
  constructor(
    private _token : TokenService,
    private _rest : RestService,
    private messageService: MessageService,
  ) { 
    this.isVisibleText = true;
  }

  ngOnInit(): void {
    this.getDataProfile();
  }

  getDataProfile(){
    const data = this._token.getTokenDataUser() as string;
    this.user = JSON.parse(data);
    this.getRoleUser(this.user.id_role!);
    this.completeData = true;
    
    switch (this.user.id_identification_type) {
      case 1: this.typeDocument = "Cédula"
        
      break;
      case 2: this.typeDocument = "Pasaporte"
      
      break;
      case 3: this.typeDocument = "RUC"
        
      break;
      default:
        break;
    }
  }

  getRoleUser(id_role : number){
    const roles : any= {
      1 : 'Gerente',
      2 : 'Administrador',
      3 : 'Contable',
      4 : 'Vendedor',
      5 : 'Cliente'
    }

    this.roleUser = roles[id_role];
  }

  changeInformation(){
    this.submitted = true;
    if(!this.validateInputs()) return ;

    this.displayModal = true;

    this.validatePassword();
  }

  saveChangeInformation(){
    this.loading = true;
    this.isVisibleText = false;
    this._rest.updateEmployee(this.user).subscribe((response)=>{
      if(response.status == 200 || response.message === "Usuario actualizado exitosamente"){
        this.messageService.add({severity:'success', summary: 'Completado', detail: 'Datos actualizado con éxito', life:3000});
        localStorage.setItem('user', JSON.stringify(this.user));
        setTimeout(() => {
          window.location.reload();
          this.loading = false;
          this.isVisibleText = true;
          this.displayModal=false
          this.buttonCancel = false;
        }, 1000);
      }else{
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Error al actualizar datos', life:3000});
      }
    });
  }

  validateInputs(){
    if(!this.user.user_name || !this.user.user_lastName || !this.user.user_phone || !this.user.user_address || !this.user.user_document || !this.user.email) return false;

    return true;
  }

  validatePassword(){
    if(!this.confirmPassword) return false;

    this.loading = true;
    this.isVisibleText = false;
    this.buttonCancel = true;
    const opc = {
      id_user : this.user.id_user,
      password : this.confirmPassword
    }

    this._rest.validatePassword(opc).subscribe((response)=>{
      if(response.status == 200 || response.message === "Coincide"){
        this.saveChangeInformation();
      }else{
        return;
      }
    });

    return ;
  }

  @HostListener('document:keydown', ['$event']) onHover(event: KeyboardEvent){
    if(event.key != "Enter") return;
    this.changeInformation();
  }
}
