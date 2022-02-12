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
      for(let i = 0; i < this.types_provider.length ; i++){
        this._sortByOrder.transform(`${this.types_provider[i].type_provider_name}`);
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

  hideDialog(){
    this.productDialog = false;

  }

  saveProvider(){
    if(this.actionSelected === "new"){
      this.saveData();

    }else if(this.actionSelected === "edit"){
        this.updateData();
    }
  }

  saveData(){
    this._rest.createProvider(this.provider)
    .subscribe((response)=>{
        if(response.status == 200 || response.message === "Proveedor creado con exito"){
            this.getProviders();
            this.hideDialog();
            this.messageService.add({severity:'success', summary: 'Completado', detail: 'El Proveedor fue creado con éxito'});
        }
    });
  }

  updateData(){
    this._rest.updateProvider(this.provider, this.provider.id_provider!)
    .subscribe((response)=>{
        if(response.status == 200 || response.message === "Proveedor actualizado con exito"){
            this.getProviders();
            this.hideDialog();
            this.messageService.add({severity:'success', summary: 'Completado', detail: 'El proveedor fue actualizado con éxito'});
        }else if(response.status == 400 || response.status == 500 || response.message === "Ocurrio un error interno en el servidor"){
            this.hideDialog();
            this.messageService.add({severity:'error', summary: 'Error', detail: 'Ocurrio un error'});
        }
    });
  }

  editProvider(provider : IProvider){
    this.actionSelected = "edit"
    this.provider = {...provider};
    this.productDialog = true; // abrimos modal
  }

  deleteProvider(provider : IProvider){
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar el producto: ' + '"'+provider.provider_name + '"'+'?',
      header: 'Eliminar Producto',
      acceptLabel : 'Eliminar',
      rejectLabel : 'Cancelar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this._rest.deleteProvider(provider.id_provider!).subscribe((response)=>{
              if(response.status == 200 || response.message === "Eliminado correctamente"){
                  this.getProviders();
                  this.messageService.add({severity:'success', summary: 'Completado', detail: 'Proveedor Inactivado', life: 3000});
              }
          },(err)=>{
            console.log(err.error);
          });
      }
  });
    
  }
}
