import { UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User } from 'src/app/models/user';
import { RestService } from 'src/app/services/rest.service';
import { TokenService } from 'src/app/services/token.service';
import { verificarRuc } from 'udv-ec';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  providers : [MessageService,ConfirmationService, UpperCasePipe]
})
export class ReportComponent implements OnInit {

  users : User[] = [];

  user : User = {};
  userLoged : User = {};

  actionSelected  : string ="";
  productDialog: boolean = false;
  submitted: boolean = false;
  stateIdentification : boolean = false;
  stateCheckActive : boolean = true;
  messageIdentification : string = "";
  stateCheckInactive : boolean = false;
  states : any[] = [];
  changePassword : boolean = false;

  identificationType : any [] = [];
  types_employees : any
  maxLength : number = 0;
  userAux : User[] = [];
  

  regexLetterSpace : RegExp = /[ a-zA-ZñÑáéíóúÁÉÍÓÚ]+$/;  
  
  constructor(
    private _rest : RestService,
    private messageService: MessageService, 
    private confirmationService: ConfirmationService,
    private _sortByOrder : UpperCasePipe,
    private _token : TokenService,
  ) { }

  ngOnInit(): void {
    this.states = [
      {name: 'Activo', id: 1, icon : 'pi pi-thumbs-up'},
      {name: 'Inactivo', id: 0, icon : 'pi pi-thumbs-down'},
    ];
    this.identificationType = [
      {id:1, name:'Cédula', icon : 'pi pi-id-card'},
      {id:2, name:'Pasaporte', icon : 'pi pi-wallet'},
    ];
    this.types_employees=[
      {id:2, name:'Administrador'},
      {id:3, name:'Contable'},
      {id:4, name:'Vendedor'},
    ];

    this.getEmployees();
    this.getDataProfile();
  }

  openNew(){
    this.actionSelected = "new"
    this.user = {}; // seteamos el producto
    this.submitted = false; // le decimos que no valide ningun campo
    this.stateIdentification = false;
    this.productDialog = true; // abrimos el moda
    this.user.user_status = 1;
    this.changePassword = false;
  }

  exportPdf(){}

  hideDialog(){
    this.productDialog = false;
  }

  getEmployees(){
    this._rest.getEmployees().subscribe((response : User[])=>{
      this.userAux = Object.values(response);
      if(this.stateCheckActive && !this.stateCheckInactive){
        this.users = this.userAux.filter(i => i.user_status == 1);
      }else if(!this.stateCheckActive && this.stateCheckInactive){
        this.users = this.userAux.filter(i => i.user_status == 0);
      }else if(this.stateCheckActive && this.stateCheckInactive){
        this.users = this.userAux;
      }
      
    })
  }

  getDataProfile(){
    const data = this._token.getTokenDataUser() as string;
    this.userLoged = JSON.parse(data);
  }

  createEmployee(){
    this.user.user_phone = this.user.user_phone?.replace(/ /g, "");
    this.user.id_user_created = this.userLoged.id_user;
   
    if(this.actionSelected === "new"){
      this.submitted = true;
      if(!this.validateIdentification()){
        this.messageIdentification = 'Identificación invalida';
        return ;
      }else{
        this.messageIdentification = '';
        this.createEmployee();
      }

    }else if(this.actionSelected === "edit"){
      this.submitted = true;
      if(!this.validateIdentification()){
        this.messageIdentification = 'Identificación invalida';
        return ;
      }else{
        this.messageIdentification = '';
        this.updateEmployee();
      }
    }

    this._rest.createEmployee(this.user).subscribe((response)=>{
      if(response.status == 200 || response.message === "Usuario creado exitosamente"){
        this.getEmployees();
        this.hideDialog();
        this.messageService.add({severity:'success', summary: 'Completado', detail: 'El empleado fue creado con éxito', life:3000});
    }
    });
  }

  updateEmployee(){
    this._rest.updateEmployee(this.user).subscribe((response)=>{
      if(response.status == 200 || response.message === "Usuario actualizado exitosamente"){
        this.getEmployees();
        this.hideDialog();
        this.messageService.add({severity:'success', summary: 'Completado', detail: 'Empleado actualizado con éxito', life:3000});
    }
    });
  }

  changeIdentification($event : any){
    if($event.value == 1) this.maxLength = 10;
    if($event.value == 2) this.maxLength = 20;
  }

  change($event : any){
    if(this.stateCheckActive && this.stateCheckInactive){
        this.users = this.userAux; 
    }

    if(!this.stateCheckActive && !this.stateCheckInactive) this.users = [] ;

    this.getEmployeesActives();
    this.getEmployeesInactive();
  }

  getEmployeesActives(){
    if(this.stateCheckActive && !this.stateCheckInactive){
        this.users = this.userAux.filter( i => i.user_status == 1);
    }
  }

  getEmployeesInactive(){
      if(!this.stateCheckActive && this.stateCheckInactive){
          this.users = this.userAux.filter( i => i.user_status == 0)
      }
  }

  validateIdentification(){
    if(this.user.id_identification_type == 1) return this.validateCedula();
    if(this.user.id_identification_type == 2) return this.validatePasaporte();
    if(this.user.id_identification_type == 3) return verificarRuc(this.user.user_document!);
    
    return false;
  }

  validateCedula(){
    this.stateIdentification = true;
    let cedula = this.user.user_document!;
    let firsTwoDigits = parseInt(String(cedula?.slice(0,2)));
    let lastDigit = cedula.slice(9);
    let digits :any = cedula.slice(0,9);
    let resultPar = 0;
    let sumaPar = 0;
    let sumaImpar = 0;
    let total = 0;
    let base = 0;

    if(cedula!?.length < 10) return false;
    if((firsTwoDigits > 0 && firsTwoDigits < 25) || firsTwoDigits == 30){
      for (let i = 0; i < digits!.length; i++) {
        if(i%2 == 0) {
           resultPar = digits[i] * 2;
           if(resultPar > 9){
            resultPar = resultPar - 9;
           }
           sumaPar += resultPar;
        }else{
            sumaImpar += parseInt(digits[i]);
        }
      }

      total = sumaPar + sumaImpar;
      base = ((parseInt(String(sumaPar + sumaImpar).slice(0,1))+1)*10) - total;
      if(lastDigit === String(base)){
          return true;
      }else{
          return false;
      }
    }else{
      return false;
    }
  }

  validatePasaporte(){
    let pasaporte = parseInt(this.user.user_document!);
    if(pasaporte < 14 || pasaporte > 20){
      return false;
    } 

    return true;
  }

  regexCode(event: any) {
    event.target.value = event.target.value.replace(/[^0-9a-zA-ZáéíñóúüÁÉÍÑÓÚÜ_-]/g, "");
  }

  editUser(user : User){
    this.actionSelected = "edit"
    this.user = {...user};
    this.productDialog = true; // abrimos modal
  }

  deleteEmployee(user : User){
    this.confirmationService.confirm({
      message: `¿Estás seguro de inactivar al usuario: ${user.user_name} ${user.user_lastName} ?`,
      header: 'Inactivar Usuario',
      acceptLabel : 'Inactivar',
      rejectLabel : 'Cancelar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this._rest.deleteEmployee(user.id_user!).subscribe((response)=>{
              if(response.status == 200 || response.message === "Eliminado correctamente"){
                  this.getEmployees();
                  this.messageService.add({severity:'success', summary: 'Completado', detail: 'Usuario inactivado', life: 3000});
              }
          },(err)=>{
            console.log(err.error);
          });
      }
    });
  }
}
