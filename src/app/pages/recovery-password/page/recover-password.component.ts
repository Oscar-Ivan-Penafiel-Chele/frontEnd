import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig, MessageService } from 'primeng/api';
import { RecoveryPasswordService } from '../service/recovery-password.service';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css'],
  providers : [MessageService]
})
export class RecoverPasswordComponent implements OnInit {
  submitted: boolean = false;
  password: string = "";
  changePassword: boolean = true;
  confirmatePassword: string = "";
  isLoading: boolean = false;
  id_user: number | undefined;
  showOverlay: boolean = false;
  loadRequest: boolean = false;
  iconResponse: string = "";
  textResponse: string = "";
  iconButton: string = "";
  textButton: string = "";
  textOverlay:string = "Cambiando Contraseña";
  showButtonDynamic: boolean = true;
  url: string = "/login";
  showButtons: boolean = true;

  constructor(
    private primengConfig: PrimeNGConfig, 
    private changePasswordService: RecoveryPasswordService,
    private messageService: MessageService,
  ) { 
    this.primengConfig.setTranslation({
      weak : 'Débil',
      medium : 'Bueno',
      strong : 'Excelente',
      passwordPrompt : '',
    });
  }

  ngOnInit(): void {
    this.getIdUser();
  }

  getIdUser(){
    if(!localStorage.getItem('response')) return;

    let data = localStorage.getItem('response');
    this.id_user = parseInt(data!);
  }

  validateInformation(){
    this.submitted = true;

    if(!this.validateData()) return;
    if(!this.validateLengthPassword()) return;
    if(!this.validateMatchPassword()) return;

    this.createRequest();
  }


  createRequest(){
    this.showOverlay = true;
    this.loadRequest = true;

    let data: any = {
      password: this.password
    }

    this.changePasswordService.changePassword(data, this.id_user!).subscribe((response: any)=>{
      this.loadRequest = false;

      if(response.message != "Contraseña actualizado exitosamente"){
        this.showOverlay = false;
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Error al actualizar la contraseña', life:3000});
        return;
      }

      this.iconResponse = "pi pi-check-circle response_ok";
      this.textResponse = "Contraseña actualizada exitosamente!";
      this.textButton = "Ir al Login";
      this.iconButton = "pi pi-sign-in mr-2";
    }, err=>{
      this.messageService.add({severity:'error', summary:'Error', detail:`Ha ocurrido un error en el servidor`});
    });

  }


  validateData(): boolean{
    if(!this.password || !this.confirmatePassword) return false;
    return true;
  }

  validateLengthPassword(): boolean{
    if(this.password.length < 9 || this.confirmatePassword.length < 9) return false;
    return true;
  }

  validateMatchPassword(): boolean{
    if(this.password != this.confirmatePassword) return false;
    return true;
  }
}