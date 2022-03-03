import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user : User = {};
  roleUser : string = "";
  submitted : boolean = false;
  input_phone : boolean =true;
  displayModal : boolean = false;
  confirmPassword : string = "";
  
  constructor(
    private _token : TokenService,
  ) { }

  ngOnInit(): void {
    this.getDataProfile();
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

  changeInformation(){
    this.submitted = true;

    if(!this.validateInputs()) return ;

    this.displayModal = true;

    if(!this.validatePassword()) return ; //validar si contraseñas no coinciden
  }

  validateInputs(){
    if(!this.user.user_name || !this.user.user_lastName || !this.user.user_phone || !this.user.user_address || !this.user.user_document || !this.user.email) return false;

    return true;
  }

  validatePassword(){
    if(!this.confirmPassword) return false;

    //realizar peticion
    

    return true;
  }
}
