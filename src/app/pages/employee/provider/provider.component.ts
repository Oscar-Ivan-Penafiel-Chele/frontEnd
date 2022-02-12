import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { UpperCasePipe } from '@angular/common';
import { MessageService, Message, PrimeNGConfig, ConfirmationService } from 'primeng/api';
import { RestService } from 'src/app/services/rest.service';
import { IProvider } from 'src/app/models/provider';
import { Type_Provider } from 'src/app/models/type_provider';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.css'],
  providers : [MessageService,ConfirmationService, UpperCasePipe]
})
export class ProviderComponent implements OnInit {

  providers : IProvider[] = [];
  types_provider : Type_Provider[] = []; 

  provider : IProvider = {} as IProvider;

  productDialog: boolean = false;
  submitted: boolean = false;
  states : any[] = [];
  actionSelected  : string ="";

  constructor(
    private _rest : RestService,
    private messageService: MessageService, 
    private confirmationService: ConfirmationService,
    private _sortByOrder : UpperCasePipe,
  ) { }

  ngOnInit(): void {
    this.states = [
      {name: 'Activo', id: 1, icon : 'pi pi-thumbs-up'},
      {name: 'Inactivo', id: 0, icon : 'pi pi-thumbs-down'},
    ];
    this.getProviders();
    this.getTypeProviders();
  }

  getProviders(){
    this._rest.getProviders().subscribe((response : IProvider[])=>{
      this.providers = Object.values(response);
    })
  }

  getTypeProviders(){
    this._rest.getTypeProviders().subscribe((response : Type_Provider[])=>{
      this.types_provider = Object.values(response);
      console.log(this.types_provider);
      for(let i = 0; i < this.types_provider.length ; i++){
        this._sortByOrder.transform(`${this.types_provider[i].type_provider_description}`);
      }
    });
  }

  openNew(){
    this.actionSelected = "new"
    this.provider = {}; // seteamos el producto
    this.submitted = false; // le decimos que no valide ningun campo
    this.productDialog = true; // abrimos el modal
    this.provider.provider_status = 1;  // asignamos el status por defecto a : Activo
  }

  exportPdf(){}

  regexCode(event: any) {
    event.target.value = event.target.value.replace(/[^0-9a-zA-ZáéíñóúüÁÉÍÑÓÚÜ_-]/g, "");
}

  hideDialog(){}
  saveProvider(){}

  editProvider(provider : IProvider){}
  deleteProvider(provider : IProvider){}
}
