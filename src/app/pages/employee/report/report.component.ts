import { UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User } from 'src/app/models/user';
import { RestService } from 'src/app/services/rest.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  providers : [MessageService,ConfirmationService, UpperCasePipe]
})
export class ReportComponent implements OnInit {

  users : User[] = [];

  user : User = {};

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
      console.log(response);
      this.userAux = Object.values(response);
      this.users = this.userAux.filter(i => i.user_status == 1);
    })
  }

  createEmployee(){
    this.user.user_phone = this.user.user_phone?.replace(/ /g, "");
    //validaciones
    if(this.actionSelected === "new"){
      this.submitted = true;
      // if(!this.validateIdentification()){
      //   this.messageIdentification = 'Identificación invalida';
      //   return ;
      // }else{
      //   this.messageIdentification = '';
      // aqui iria la funcion de guardar
      // }
      this.createEmployee();

    }else if(this.actionSelected === "edit"){
      this.submitted = true;
      // if(!this.validateIdentification()){
      //   this.messageIdentification = 'Identificación invalida';
      //   return ;
      // }else{
      //   this.messageIdentification = '';
      //  aqui iria la funcion 
      //  this.updateData();
      // }
      this.updateEmployee();
    }

    this._rest.createEmployee(this.user).subscribe((response)=>{
      if(response.status == 200 || response.message === "Empleado creado con exito"){
        this.getEmployees();
        this.hideDialog();
        if(this.user.user_status == 0){
          this.stateCheckActive = true;
          this.stateCheckInactive = false;
      }
        this.messageService.add({severity:'success', summary: 'Completado', detail: 'El empleado fue creado con éxito', life:3000});
    }
    });
  }

  updateEmployee(){
    this._rest.updateEmployee(this.user).subscribe((response)=>{
      if(response.status == 200 || response.message === "Empleado actualizado con exito"){
        this.getEmployees();
        this.hideDialog();
        if(this.user.user_status == 1){
          this.getEmployees();
          this.stateCheckActive = true;
          this.stateCheckInactive = false;
        }else if(this.user.user_status == 0){
            this.getEmployeesInactive();
            this.stateCheckActive = false;
            this.stateCheckInactive = true;
        }
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
        //  this.providers = this.providersAux; 
    }

    if(!this.stateCheckActive && !this.stateCheckInactive) //this.providers = [] ;

    this.getEmployeesActives();
    this.getEmployeesInactive();
  }

  getEmployeesActives(){
    if(this.stateCheckActive && !this.stateCheckInactive){
        // this.providers = this.providersAux.filter( i => i.provider_status == 1);
    }
  }

  getEmployeesInactive(){
      if(!this.stateCheckActive && this.stateCheckInactive){
          // this.providers = this.providersAux.filter( i => i.provider_status == 0)
      }
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
      header: 'Eliminar Producto',
      acceptLabel : 'Eliminar',
      rejectLabel : 'Cancelar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this._rest.deleteProvider(user.id_user!).subscribe((response)=>{
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
