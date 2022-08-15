import { Component, OnInit } from '@angular/core';
import { IManageIVA, User } from '@models/interfaces';
import { ManageIvaService } from '../service/manage-iva.service';
import {MessageService} from 'primeng/api';
import { TokenService } from 'src/app/auth/service/token.service';

@Component({
  selector: 'app-manage-iva',
  templateUrl: './manage-iva.component.html',
  styleUrls: ['./manage-iva.component.css'],
  providers: [MessageService]
})
export class ManageIvaComponent implements OnInit {

  isLoading : boolean = true;
  data : IManageIVA[] = [];
  displayModal : boolean = false;
  manageIva : IManageIVA = {} as IManageIVA;
  submitted : boolean = false;
  user : User = {};
  options : any [] = [];
  selectedOptionFilter : any;
  dataAuxFilter : IManageIVA[] = [];

  constructor(
    private manageIvaService : ManageIvaService, 
    private messageService: MessageService,
    private _token : TokenService
    ) {
      this.options = [
        {id: '1', name : 'Activo'},
        {id: '2', name : 'Inactivo'},
        {id: '3', name : 'Todos'},
      ]
     }

  ngOnInit(): void {
    this.submitted = false;
    this.getIva();
    this.getUser();
  }

  getUser(){
    const data = localStorage.getItem('user');
    this.user = JSON.parse(data!);
  }

  getIva(){
    this.selectedOptionFilter = 3;
    this.manageIvaService.getManageIva().subscribe((response : IManageIVA[])=>{
      this.data = Object.values(response);
      this.dataAuxFilter = this.data;
      this.isLoading = false;
    }, err =>{
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un problema en el servidor', life: 3000});
    });
  }

  createIva( iva : IManageIVA){
    iva.id_user = this.user.id_user!;
    this.isLoading = true;

    this.manageIvaService.createIva(iva).subscribe((response : any)=>{
      if(response.status == 200 || response.message == "Iva guardado exitosamente"){
        this.getIva();
        this.messageService.add({severity:'success', summary: 'Completado', detail: `${response.message}`, life : 3000});
      }else if(response.status >= 400 ){
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un problema en el servidor', life : 3000});
      }

      this.displayModal = false;
      this.isLoading = false;
    }, err =>{
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un problema en el servidor', life: 3000});
    })
  }

  openModal(){
    this.displayModal = true;
  }

  change($event : any){
    let filter = 0;

    filter = $event.path[2].attributes[1].value

    if(filter == 1){
      this.data = this.dataAuxFilter.filter( i => i.iva_status == 1)
    }else if( filter == 2){
      this.data = this.dataAuxFilter.filter( i => i.iva_status == 0)
    }else if(filter == 3){
      this.data = this.dataAuxFilter;
    }
  }
}
