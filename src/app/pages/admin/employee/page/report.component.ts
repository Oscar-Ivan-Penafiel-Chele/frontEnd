import { UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User } from '@models/interfaces';
import { verificarRuc } from 'udv-ec';
import { Canvas, Columns, Img, Line, PdfMakeWrapper, Stack, Table, Txt  } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { TokenService } from 'src/app/auth/service/token.service';
import { EmployeeService } from '../service/employee.service';
import { ValidationsService } from 'src/app/shared/services/validations/validations.service';
import { GeneratePdfEmployeeService } from 'src/app/shared/services/pdfs/generate-pdf-employee.service';

PdfMakeWrapper.setFonts(pdfFonts);

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
  loading : boolean = false;
  messageIdentification : string = "";
  stateCheckInactive : boolean = false;
  states : any[] = [];
  changePassword : boolean = false;
  isVisible : boolean = false;

  identificationType : any [] = [];
  types_employees : any
  maxLength : number = 10;
  userAux : User[] = [];


  regexLetterSpace : RegExp = /[ a-zA-ZñÑáéíóúÁÉÍÓÚ]+$/;

  constructor(
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private _token: TokenService,
    private validationService: ValidationsService,
    private generatePdfEmployeeService : GeneratePdfEmployeeService
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
      {id:1, name:'Gerente'},
      {id:2, name:'Administrador'},
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
    this.changePassword = true;
    this.isVisible = false;
  }

  hideDialog(){
    this.productDialog = false;
  }

  getEmployees(){
    this.loading = true;
    this.employeeService.getEmployees().subscribe((response : User[])=>{
      this.userAux = Object.values(response);
      if(this.stateCheckActive && !this.stateCheckInactive){
        this.users = this.userAux.filter(i => i.user_status == 1);
      }else if(!this.stateCheckActive && this.stateCheckInactive){
        this.users = this.userAux.filter(i => i.user_status == 0);
      }else if(this.stateCheckActive && this.stateCheckInactive){
        this.users = this.userAux;
      }
      this.loading = false;
    })
  }

  getDataProfile(){
    const data = this._token.getTokenDataUser();
    this.user = data;
    this.getRoleUser(this.user.id_role!);
  }

  getRoleUser(id_role : number){
    const roles : any= {
      1 : 'Gerente',
      2 : 'Administrador',
      3 : 'Contable',
      4 : 'Vendedor'
    }
  }

  async exportPdf() {
    this.generatePdfEmployeeService.generatePDF(this.user, this.users);
  }

  createEmployee(){
    this.user.user_phone = this.user.user_phone?.replace(/ /g, "");
    this.user.id_user_created = this.userLoged.id_user;

    if(this.actionSelected === "new"){
      this.submitted = true;
      if(!this.regexData(this.user.email!)) return;
      if(!this.validateIdentification()){
        this.messageIdentification = 'Identificación no válida';
        return ;
      }else{
        this.messageIdentification = '';
        if(!this.validateInputs()) return;
        if(!this.user.password || this.user.password.length < 8) return;
        if(!this.regexPassword(this.user.password!)) return;

        this.isExistEmail(this.user.email!, this.user.user_document!);
      }

    }else if(this.actionSelected === "edit"){
      this.submitted = true;
      if(!this.regexData(this.user.email!)) return;
      if(!this.validateIdentification()){
        this.messageIdentification = 'Identificación no válida';
        return ;
      }else{
        this.messageIdentification = '';
        if(!this.validateInputs()) return;
        if(this.changePassword && !this.regexPassword(this.user.password!)) return;
        this.updateEmployee();
      }
    }
  }

  validateInputs(){
    if(
      !this.user.user_name || this.user.user_name.length < 3 ||
      !this.user.user_lastName || this.user.user_lastName.length < 3 ||
      !this.user.email ||
      !this.user.user_phone ||  this.user.user_phone.length < 11 ||
      !this.user.id_role || this.user.id_role == null ||
      !this.user.user_status || this.user.user_status == null ||
      !this.user.id_identification_type || this.user.id_identification_type == null ||
      !this.user.user_document ||
      !this.user.user_address || this.user.user_address.length < 5
    ) return false;

    return true;
  }

  requestSaveData(){
    this.employeeService.createEmployee(this.user).subscribe((response)=>{
      if(response.status == 200 || response.message === "Usuario creado exitosamente"){
        this.getEmployees();
        this.hideDialog();
        this.messageService.add({severity:'success', summary: 'Completado', detail: 'El empleado fue creado con éxito', life:3000});
      }else{
        console.log(response)
        this.messageService.add({severity:'error', summary: 'Error', detail: `${response.message[0]}`, life:3000});
      }
    }, err =>{
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un error en el servidor', life:3000});
    });
  }

  updateEmployee(){
    this.employeeService.updateEmployee(this.user).subscribe((response)=>{
      if(response.status == 200 || response.message === "Usuario actualizado exitosamente"){
        this.getEmployees();
        this.hideDialog();
        this.messageService.add({severity:'success', summary: 'Completado', detail: 'Empleado actualizado con éxito', life:3000});
      }else{
        console.log(response)
        this.messageService.add({severity:'error', summary: 'Error', detail: `${response.message[0]}`, life:3000});
      }
    }, err =>{
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un error en el servidor', life:3000});
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

  regexData(email : string){
    let regexEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

     return regexEmail.test(email);
  }

  regexPassword(password: string){
    let regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    return regexPassword.test(password);
  }

  editUser(user : User){
    this.actionSelected = "edit"
    this.user = {...user};
    this.productDialog = true; // abrimos modal
    this.changePassword = false;
    this.isVisible = true;
  }

  deleteEmployee(user : User){
    this.confirmationService.confirm({
      message: `¿Estás seguro de inactivar al usuario: ${user.user_name} ${user.user_lastName} ?`,
      header: 'Inactivar Usuario',
      acceptLabel : 'Inactivar',
      rejectLabel : 'Cancelar',
      rejectButtonStyleClass: 'p-button-outlined p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.employeeService.deleteEmployee(user.id_user!, this.userLoged.id_user!).subscribe((response)=>{
              if(response.status == 200 || response.message === "Eliminado correctamente"){
                  this.getEmployees();
                  this.messageService.add({severity:'success', summary: 'Completado', detail: 'Usuario inactivado', life: 3000});
              }
          },(err)=>{
            this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un error en el servidor', life: 3000});
          });
      }
    });
  }

  isExistEmail(email: string, identificación: string){
    this.validationService.validateEmailDuplicate({email: email}).subscribe((response) =>{
      if(response.message == "Existe"){
        this.messageService.add({severity:'error', summary: 'Error', detail: 'El correo electrónico ya existe', life: 3000});
        return;
      }

      this.isExistIdentification(identificación);
    }, err =>{
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un error en el servidor', life: 3000});
    })
  }

  isExistIdentification(identification: string){
    this.validationService.validateIdentificationDuplicate({user_document: identification}).subscribe((response)=>{
      if(response.message == "Existe"){
        this.messageService.add({severity:'error', summary: 'Error', detail: 'La identificación ya existe', life: 3000});
        return;
      }

      this.requestSaveData();
    }, err =>{
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un error en el servidor', life: 3000});
    })
  }
}
