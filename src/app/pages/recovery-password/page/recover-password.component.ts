import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrimeNGConfig, MessageService } from 'primeng/api';
import { ForgetPasswordService } from '../../forget-password/service/forget-password.service';
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
  id_route: string = "";

  constructor(
    private primengConfig: PrimeNGConfig,
    private changePasswordService: RecoveryPasswordService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private forgetPasswordService: ForgetPasswordService
  ) {
    this.primengConfig.setTranslation({
      weak : 'Débil',
      medium : 'Bueno',
      strong : 'Excelente',
      passwordPrompt : '',
    });
  }

  ngOnInit(): void {
    this.getId();
  }

  getId(){
    this.route.params.subscribe(params=>{
      this.id_route = params['id'];
    })
  }

  validateInformation(){
    this.submitted = true;

    if(!this.validateData()) return;
    if(!this.validateLengthPassword()) return;
    if(!this.validateMatchPassword()) return;
    if(!this.validatePasswordRegex(this.password)) return;
    if(!this.validatePasswordRegex(this.confirmatePassword)) return;

    this.createRequest();
  }


  createRequest(){
    let id = this.forgetPasswordService.decryptedId(this.id_route);

    this.showOverlay = true;
    this.loadRequest = true;

    let data: any = {
      password: this.password,
      is_link: 1
    }

    this.changePasswordService.changePassword(data, parseInt(id!)).subscribe((response: any)=>{
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

  validatePasswordRegex(password: string): boolean{
    let regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;

     return regexPassword.test(password);
  }


  @HostListener('document:keydown', ['$event']) onHover(event: KeyboardEvent){
    if(event.key != "Enter") return;
    this.validateInformation();
  }
}
