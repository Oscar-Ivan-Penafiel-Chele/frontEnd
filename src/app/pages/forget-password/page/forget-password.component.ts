import { Component, OnInit } from '@angular/core';
import { ConfirmationService, PrimeNGConfig, MessageService, Message } from 'primeng/api';
import { ValidationsService } from 'src/app/shared/services/validations/validations.service';
import { environment } from 'src/environments/environment.prod';
import { ForgetPasswordService } from '../service/forget-password.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
  providers : [MessageService,ConfirmationService]
})
export class ForgetPasswordComponent implements OnInit {

  email: string = "";
  isLoading: boolean = false;
  submitted: boolean = false;
  showOverlay: boolean = false;
  loadRequest: boolean = false;
  textOverlay: string = "Comprobando Información";
  errorEmail: boolean = false;
  msgs1: Message[] = [];
  isCompleteRequest: boolean = false;
  route: string = "http://localhost:4200";

  constructor(
    private primengConfig: PrimeNGConfig,
    private validateService: ValidationsService,
    private messageService: MessageService, 
    private forgetService: ForgetPasswordService
  ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  createRequest(){
    this.isLoading = true;
    this.submitted = true;
    if(!this.validateInput() || !this.validateEmail()){
      this.isLoading = false;
      return;
    } 
    
    if(this.isExistRequest()){
      this.isLoading = false;
      this.messageService.clear();
      this.messageService.add({severity:'info', summary: 'Info', detail: 'Ya existe una petición en curso, por favor revise su correo electrónico', life: 3000});
      return;
    };

    this.loadRequest = true;
    this.showOverlay = true;
    this.sendEmail();
  }

  validateInput(): boolean{
    if(!this.email) return false;
    return true;
  }

  validateEmail(): boolean{
    let regexEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    return regexEmail.test(this.email);
  }

  sendEmail(){
    this.validateService.validateEmailDuplicate({email: this.email}).subscribe((response: any)=>{
      if(response.message == "No existe"){
        this.showOverlay = false;
        this.isLoading = false;
        this.errorEmail = true;
        return;
      }
      localStorage.setItem('recover-password',JSON.stringify(true));
      localStorage.setItem('response', JSON.stringify(response.id_user))
      this.generateRequest(response.id_user);

    }, err=>{
      this.showOverlay = false;
      this.isLoading = false;
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un error en el servidor, intentalo más tarde', life: 3000});
    });
  }

  getValue($event: any){
    if(this.submitted) this.errorEmail = false;
  }

  generateRequest(id: number): void{
    let url: string = `${this.route}/recovery-password`;

    this.forgetService.sendEmail({id_user: id, link: url}).subscribe((response: any)=>{
      this.showOverlay = false;
      this.isLoading = false;

      if(response.message != "Correo de recuperación de clave enviado con éxito"){
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un error en el servidor, intentalo más tarde', life: 3000});
        return;
      }

      this.isCompleteRequest = true;
    }, err=>{
      this.showOverlay = false;
      this.isLoading = false;
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un error en el servidor, intentalo más tarde', life: 3000});
    })
  }

  isExistRequest(): boolean{
    if(localStorage.getItem('recover-password')) return true;
    return false;
  }
}
