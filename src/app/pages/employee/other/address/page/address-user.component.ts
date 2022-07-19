import { Component, OnInit } from '@angular/core';
import { Address, User } from 'src/app/models/user';
import {ConfirmationService, MessageService} from 'primeng/api';
import { AddressUserService } from 'src/app/services/address-user.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-address-user',
  templateUrl: './address-user.component.html',
  styleUrls: ['./address-user.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class AddressUserComponent implements OnInit {

  isLoading : boolean = true;
  displayModal : boolean = false;
  submitted : boolean = false;
  textModal : string = "";
  user : User = {};

  address : Address = {} as Address;
  addressUser : Address[] = [];
  textAction : string = "";
  options : any[] = [];

  constructor(
    private confirmationService: ConfirmationService, 
    private messageService: MessageService,
    private addressService : AddressUserService,
    private _token : TokenService,
    ) { }

  ngOnInit(): void {
    this.getDataProfile();
    this.getAddress();
    this.options = [
      {'name':'Casa', 'icon' : 'pi pi-home'},
      {'name':'Trabajo', 'icon' : 'pi pi-building'},
      {'name':'Otro', 'icon' : 'pi pi-inbox'},
    ]
  }

  getDataProfile(){
    const data = this._token.getTokenDataUser() as string;
    this.user = JSON.parse(data);
  }

  getAddress(){
    let ad = [];
    this.addressService.getAddress(this.user.id_user!).subscribe((response : Address[])=>{
      this.addressUser = this.addressService.sortAddress(response);
      this.isLoading= false;
      this.displayModal = false;
    })
  }

  selectedAction(){
    this.submitted = true;
    
    if(!this.address.user_address && !this.address.address_description) return ;

    if(this.textAction == "Crear"){
      this.createAddress();
      return ; 
    }

    this.updateAddress();
  }

  modalCreateAddress(){
    this.address = {} as Address;
    this.textModal = "Creación de dirección";
    this.textAction = "Crear";
    this.openModal();
  }

  modalUpdateAddress(address : Address){
    this.textModal = "Actualización de dirección";
    this.textAction = "Actualizar";
    this.address = address;
    this.openModal();
  }

  createAddress(){
    this.addressService.createAddress(this.address, this.user.id_user!).subscribe((response : any)=>{
      if(response.status == 200 && response.message == "Dirección guardada exitosamente"){
        this.getAddress();
        this.messageService.add({severity:'success', summary:'Completado', detail:'La dirección ha sido actualizada con éxito'});
      }else{
        this.messageService.add({severity:'error', summary:'Error', detail:`${response.message[0]}`});
        this.displayModal = false;
      }

      this.submitted = false;
    });
   
  }

  updateAddress(){
    this.isLoading = true;
    this.addressService.updateAddress(this.address.id_address , this.address).subscribe((response : any)=>{
      if(response.status == 200 && response.message == "Dirección actualizada con éxito"){
        this.getAddress();
        this.messageService.add({severity:'success', summary:'Completado', detail:'La dirección ha sido actualizada con éxito'});
      }else{
        this.messageService.add({severity:'error', summary:'Error', detail:`${response.message[0]}`});
        this.displayModal = false;
        this.isLoading = false;
      }

      this.submitted = false;
    })
  }

  deleteAddress(address : Address){
    this.confirmationService.confirm({
      message: `¿Estas seguro de eliminar la dirección: ${address.user_address}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass : 'p-button-danger p-button-text',
      acceptLabel : 'Aceptar',
      accept: () => {
        this.validateDeleteAddress(address.id_address);
       //this.requestDeleteAddress(address.id_address);     
      },
    });
  }

  requestDeleteAddress(idAddress : number){
    this.isLoading = true;
    this.addressService.deleteAddress(idAddress).subscribe((response : any)=>{
      if(response.status == 200 && response.message == "Eliminado correctamente"){
        this.messageService.add({severity:'success', summary:'Completado', detail:'La dirección ha sido eliminada con éxito'});
        this.getAddress();
      }else{
        this.displayModal = false;
        this.isLoading = false;
        this.messageService.add({severity:'error', summary:'Error', detail:`${response.message[0]}`});
      }
    });
  }

  validateDeleteAddress(id_address : number){
    this.isLoading = true;

    this.addressService.validateDelete(id_address).subscribe((response : any)=>{
      console.log(response);

      if(response.status == 200 && response.message == "no existe"){
        //this.requestDeleteAddress(id_address);
      }else if(response.status == 200 && response.message == "existe"){
        this.messageService.add({severity:'warn', summary:'Advertencia', detail:'La dirección no se puede eliminar porque se encuentra en un pedido', life : 5000});
      }else if(response.status >= 400){
        this.messageService.add({severity:'error', summary:'Error', detail:'Ha ocurrido un problema en el servidor'});
      }

      this.isLoading = false;
    })
  }

  openModal(){
    this.displayModal = true;
  }
}

