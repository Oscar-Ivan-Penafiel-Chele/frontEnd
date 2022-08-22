import { Component, HostListener, OnInit } from '@angular/core';
import { IContact } from '@models/interfaces';
import { PrimeNGConfig } from 'primeng/api';
import { ContactService } from '../service/contact.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  providers: [MessageService]
})
export class ContactComponent implements OnInit {
  completeCharge: boolean = true;
  data : IContact = {} as IContact;
  submitted : boolean;
  showError : boolean = false;
  isLoading : boolean = false;

  constructor(
    private primengConfig: PrimeNGConfig, 
    private contactService : ContactService, 
    private messageService: MessageService
    ) {
    this.submitted = false;
   }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.delayCharge();
  }

  sendComments(){
    this.submitted = true;

    if(!this.validateData()) return;

    this.requestSendComments();
  }

  requestSendComments(){
    this.isLoading = true;
    this.contactService.sendComment(this.data).subscribe((response : any)=>{
      if(response.status == 200 && response.message == "Correo recibido"){
        this.messageService.add({severity:'success', summary: 'Completado', detail: `Comentario enviado con éxito`, life : 3000});
      }else if(response.status >= 400){
        this.messageService.add({severity:'error', summary: 'Error', detail: `Ha ocurrido un problema en el servidor`, life : 3000});
      }

      this.isLoading = false;
      this.data = {} as IContact;
      this.submitted = false;
    })
  }

  validateData(){
    if(!this.data.nombres || !this.data.email || !this.regexData(this.data.email) || !this.data.comentario) return false;
    else return true;
  }

  delayCharge() : any{
    const SET_TIME_OUT_DELAY= 3000;

    setTimeout(() => {
      this.completeCharge = false;
    }, SET_TIME_OUT_DELAY);
  }

  regexData(email : string){
    let regexEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

     return regexEmail.test(email);
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event : any) {
      if(!this.getKeepSession()){
          localStorage.clear();
      }
  }

  getKeepSession(){
    if(!localStorage.getItem('keepSession')) return false;
    
    const data = localStorage.getItem('keepSession');

    if(data!.toString() == "true"){
        return true;
    }else{
        return false;
    }
  }
}
