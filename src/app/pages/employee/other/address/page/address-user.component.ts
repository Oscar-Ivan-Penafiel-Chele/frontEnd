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

  constructor(
    private confirmationService: ConfirmationService, 
    private messageService: MessageService,
    private addressService : AddressUserService,
    private _token : TokenService,
    ) { }

  ngOnInit(): void {
    this.getDataProfile();
    this.getAddress();
  }

  getDataProfile(){
    const data = this._token.getTokenDataUser() as string;
    this.user = JSON.parse(data);
  }

  getAddress(){
    this.addressService.getAddress(this.user.id_user!).subscribe((response : any)=>{
      this.isLoading= false;
      console.log(response);
    })
  }

  createAddress(){
    this.address = {} as Address;
    this.textModal = "Creación de dirección";
    this.openModal();

    
  }

  updateAddress(address : Address){
    this.textModal = "Actualización de dirección";
    this.openModal();
    this.address = address;


  }

  deleteAddress(address : Address){
    this.confirmationService.confirm({
      message: `¿Estas seguro de eliminar la dirección: ${address.description}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass : 'p-button-danger p-button-text',
      acceptLabel : 'Aceptar',
      accept: () => {
       this.requestDeleteAddress();     
      },
    });
  }

  requestDeleteAddress(){
    this.messageService.add({severity:'success', summary:'Completado', detail:'La dirección ha sido eliminada con éxito'});

    
  }

  openModal(){
    this.displayModal = true;
  }
}

