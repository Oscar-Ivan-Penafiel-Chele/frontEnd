import { Component, OnInit } from '@angular/core';
import { Address } from 'src/app/models/user';
import {ConfirmationService, MessageService} from 'primeng/api';

@Component({
  selector: 'app-address-user',
  templateUrl: './address-user.component.html',
  styleUrls: ['./address-user.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class AddressUserComponent implements OnInit {

  isLoading : boolean = false;
  displayModal : boolean = false;
  submitted : boolean = false;
  textModal : string = "";

  address : Address = {} as Address;
  addressUser : Address[] = [
    {
      id_address : 1,
      id_user : 1,
      description : "FLORIDAD NORTE"
    },
    {
      id_address : 2,
      id_user : 1,
      description : "ALGUNA DIRECCION"
    },
    {
      id_address : 3,
      id_user : 1,
      description : "ADDRESS COMPONENT"
    }
  ];

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.getAddress();
  }

  getAddress(){

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

