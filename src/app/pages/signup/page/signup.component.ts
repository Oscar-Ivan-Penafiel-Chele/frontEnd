import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message, MessageService, PrimeNGConfig } from 'primeng/api';
import { ValidationsService } from 'src/app/shared/services/validations/validations.service';
import { SignupService } from '../service/signup.service';
import { verificarRuc } from 'udv-ec';
import { User } from '@models/interfaces';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [MessageService]
})
export class SignupComponent implements OnInit {
  user : User = {} as User;
  passwordConfirm:string = "";
  checked:boolean= false;
  msgs1: Message[] = [];
  submitted : boolean = false;
  typeIdentification : any ;
  maxLength : number = 0;
  stateIdentification : boolean = false;
  stateEmail : boolean = false;
  messageIdentification : string = "";
  messageEmail : string = "";
  loading : boolean = false;
  isVisibleText : boolean;
  phoneUser : string = "";
  urlImage : string  = "../../../assets/flags/ecuador.png";

  regexLetterSpace : RegExp = /[ a-zA-ZñÑáéíóúÁÉÍÓÚ]+$/;  

  constructor(
    private primengConfig: PrimeNGConfig, 
    private _router : Router, 
    private messageService: MessageService,
    private validationsService : ValidationsService,
    private signupService : SignupService
    ) {
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
    this.typeIdentification = [
      {id:1, name:'Cédula', icon : 'pi pi-id-card'},
      {id:2, name:'Pasaporte', icon : 'pi pi-wallet'},
      {id:3, name:'RUC', icon : 'pi pi-book'}
    ],
    this.submitted = false;
    this.user.password ='';
  }

  registerUser(){
    this.user.user_phone = `(+593) ${this.phoneUser}`
    this.submitted = true;
    this.user.user_phone = this.user.user_phone?.replace(/ /g, "");
    this.user.id_role = 5;
    this.user.user_status = 1;

    !this.regexData(this.user.email!) ? this.messageEmail = 'Correo Electrónico no válido' : this.messageEmail = "";
    if(!this.regexData(this.user.email!)) return ;
    
    !this.validateIdentification() ? this.messageIdentification = 'Identificación no válida' : this.messageIdentification = '';
    if(!this.validateIdentification()) return ;
    
    if(!this.validatePassword()){
      this.msgs1 = [{severity:'error', summary:'Info', detail:'Contraseñas no coinciden'}];
      setTimeout(() => {
        this.msgs1 = [];
      }, 3000);
      return;
    }
    
    if(!this.validatePasswordRegex(this.user.password!)) return;
    if(!this.validateData()) return ;

    this.loading = true;
    this.isVisibleText = false;

    this.validateEmailDuplicate();
  }

  changeIdentification($event : any){
    if($event.value == 1) this.maxLength = 10 ; 
    if($event.value == 2) this.maxLength = 20 ;
    if($event.value == 3) this.maxLength = 13 ;
    this.user.user_document = ""; 
  }

  validateIdentification(){
    this.stateIdentification = true;
    if(this.user.id_identification_type == 1) return this.validateCedula();
    if(this.user.id_identification_type == 2) return this.validatePasaporte();
    if(this.user.id_identification_type == 3) return verificarRuc(this.user.user_document!);
    
    return false;
  }

  validateCedula(){
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

  validatePassword(){
    if(this.user.password != this.passwordConfirm) return false;

    return true;
  }

  validateData(){
    if(
      !this.user.user_name || 
      !this.user.user_lastName || 
      !this.user.email || 
      !this.phoneUser || this.phoneUser.length < 10 ||
      !this.user.user_address || this.user.user_address.length < 8 ||
      !this.user.id_identification_type || 
      !this.user.user_document || 
      !this.user.password || this.user.password.length < 8 ||
      !this.passwordConfirm || this.passwordConfirm.length < 8 ||
      !this.checked
    ){
      return false;
    }

    return true;
  }

  regexData(email : string){
    this.stateEmail = true;
    let regexEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

     return regexEmail.test(email);
  }

  regexCedula(event: any) {
    event.target.value = event.target.value.replace(/[^0-9a-zA-ZáéíñóúüÁÉÍÑÓÚÜ]/g, "");
    if(event.data == null){
      this.messageIdentification = '';
    }
  }

  validateEmailDuplicate(){
    const data = {
      email : this.user.email
    }

    this.validationsService.validateEmailDuplicate(data).subscribe((response)=>{
      if(response.status == 200 && response.message == "Existe"){
        this.messageService.add({severity:'error', summary: 'Error', detail: 'El correo electrónico ya está en uso', life:3000});
        this.loading = false;
        this.isVisibleText = true;
        return false;
      }else if(response.status == 200 && response.message == "No existe"){
        this.validateIdentificationDuplicate();
        return true;
      }
      return true;
    })  
  }

  validateIdentificationDuplicate(){
    const data = {
      user_document : this.user.user_document
    }

    this.validationsService.validateIdentificationDuplicate(data).subscribe((response)=>{
      if(response.status == 200 && response.message == "Existe"){
        this.messageService.add({severity:'error', summary: 'Error', detail: 'La identificación ya está en uso', life:3000});
        this.loading = false;
        this.isVisibleText = true;
      }else if(response.status == 200 && response.message == "No existe"){
        this.saveRegister();
      }
    });
  }

  saveRegister(){
    this.signupService.createClient(this.user).subscribe((response:any) =>{
      if(response.status === 200 || response.message === 'Usuario creado exitosamente'){
        this.messageService.add({severity:'success', summary: 'Completado', detail: 'La cuenta fue creada con éxito', life:3000});
        setTimeout(() => {
          this._router.navigate(['login']);
        }, 1000);
      }else if(response.status === 500 || response.message === 'Ocurrio un error interno en el servidor'){
       this.loading = false;
       this.isVisibleText = true;
       return;
      }
    })
  }

  @HostListener('document:keydown', ['$event']) onHover(event: KeyboardEvent){
    if(event.key != "Enter") return;
    this.registerUser();
  }


  validatePasswordRegex(password: string): boolean{
    let regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;

     return regexPassword.test(password);
  }
}
