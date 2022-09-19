import { Component, OnInit } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { MessageService, ConfirmationService } from 'primeng/api';
import { IProvider, Type_Provider, User } from '@models/interfaces';
import { verificarRuc } from 'udv-ec';
import { PdfMakeWrapper} from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { TokenService } from 'src/app/auth/service/token.service';
import { ProviderService } from '../service/provider.service';
import { GeneratePdfProviderService } from 'src/app/shared/services/pdfs/generate-pdf-provider.service';
import { GenerateCsvProviderService } from 'src/app/shared/services/pdfs/generate-csv-provider.service';
import { ValidationsService } from 'src/app/shared/services/validations/validations.service';

PdfMakeWrapper.setFonts(pdfFonts);

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
  user : User = {};
  productDialog: boolean = false;
  submitted: boolean = false;
  states : any[] = [];
  qualified : any[] = [];
  actionSelected  : string ="";

  stateCheckActive : boolean = true;
  stateCheckInactive : boolean = false;
  loading : boolean = false;
  providersAux : IProvider[] = [];

  identificationType : any [] = [];
  messageIdentification : string = "";
  maxLength : number = 10;
  stateIdentification : boolean = false;

  constructor(
    private providerService : ProviderService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private _sortByOrder : UpperCasePipe,
    private _token : TokenService,
    private generatePDFService: GeneratePdfProviderService,
    private generateCSVService: GenerateCsvProviderService,
    private validationServices: ValidationsService
  ) { }

  ngOnInit(): void {
    this.states = [
      {name: 'Activo', id: 1, icon : 'pi pi-thumbs-up'},
      {name: 'Inactivo', id: 0, icon : 'pi pi-thumbs-down'},
    ];
    this.qualified = [
      {name: 'Si', id: 1, icon : 'pi pi-thumbs-up'},
      {name: 'No', id: 0, icon : 'pi pi-thumbs-down'},
    ];
    this.identificationType = [
      {id:1, name:'Cédula', icon : 'pi pi-id-card'},
      {id:2, name:'Pasaporte', icon : 'pi pi-wallet'},
      {id:3, name:'RUC', icon : 'pi pi-book'}
    ];
    this.getProviders();
    this.getTypeProviders();
    this.getDataProfile();
  }

  getDataProfile(){
    const data = this._token.getTokenDataUser();
    this.user = data;
  }

  getProviders(){
    this.loading = true;
    this.providerService.getProviders().subscribe((response : IProvider[])=>{
      this.providersAux = Object.values(response);
      this.providersAux = this.providersAux.filter((i)=> i.provider_name != 'NO_DEFINIDO')
      if(this.stateCheckActive && !this.stateCheckInactive){
        this.providers = this.providersAux.filter(i => i.provider_status == 1);
      }else if(!this.stateCheckActive && this.stateCheckInactive){
        this.providers = this.providersAux.filter(i => i.provider_status == 0);
      }else if(this.stateCheckActive && this.stateCheckInactive){
        this.providers = this.providersAux;
      }
      this.loading = false;
    }, err =>{
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un error en el servidor', life:3000});
    })
  }

  getTypeProviders(){
    this.providerService.getTypeProviders().subscribe((response : Type_Provider[])=>{
      this.types_provider = Object.values(response);
      for(let i = 0; i < this.types_provider.length ; i++){
        this._sortByOrder.transform(`${this.types_provider[i].type_provider_name}`);
      }
    }, err =>{
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un problema en el servidor', life: 3000});
    });
  }

  openNew(){
    this.actionSelected = "new"
    this.provider = {}; // seteamos el producto
    this.submitted = false; // le decimos que no valide ningun campo
    this.stateIdentification = false;
    this.productDialog = true; // abrimos el modal
    this.provider.provider_status = 1;  // asignamos el status por defecto a : Activo
    this.provider.provider_qualified = 1;  // asignamos el calificado por defecto a : Si
  }


  change($event : any){
    if(this.stateCheckActive && this.stateCheckInactive){
         this.providers = this.providersAux;
    }

    if(!this.stateCheckActive && !this.stateCheckInactive) this.providers = [] ;

    this.getProvidersActives();
    this.getProvidersInactives();
  }

  getProvidersActives(){
    if(this.stateCheckActive && !this.stateCheckInactive){
        this.providers = this.providersAux.filter( i => i.provider_status == 1);
    }
  }

  getProvidersInactives(){
      if(!this.stateCheckActive && this.stateCheckInactive){
          this.providers = this.providersAux.filter( i => i.provider_status == 0)
      }
  }

  async exportPdf() {
    this.generatePDFService.generatePDF(this.providers, this.user);
  }

  regexCode(event: any) {
    event.target.value = event.target.value.replace(/[^0-9a-zA-ZáéíñóúüÁÉÍÑÓÚÜ_-]/g, "");
  }

  hideDialog(){
    this.productDialog = false;
  }

  saveProvider(){
    if(this.actionSelected === "new"){
      this.submitted = true;
      if(!this.validateIdentification()){
        this.messageIdentification = 'Identificación no válida';
        return ;
      }else{
        if(!this.validateData() || !this.regexData(this.provider.provider_email!)) return ;
        this.messageIdentification = '';
        this.isExistProviderName();
      }

    }else if(this.actionSelected === "edit"){
      this.submitted = true;
      if(!this.validateIdentification()){
        this.messageIdentification = 'Identificación no válida';
        return ;
      }else{
        if(!this.validateData() || !this.regexData(this.provider.provider_email!)) return ;
        this.messageIdentification = '';

        this.updateData();
      }
    }
  }

  saveData(){
    this.submitted = true;
    this.provider.provider_phone = this.provider.provider_phone?.replace(/ /g, "");
    this.provider.id_user = this.user.id_user;

    this.providerService.createProvider(this.provider)
    .subscribe((response)=>{
        if(response.status == 200 || response.message === "Proveedor creado con exito"){
            this.getProviders();
            this.hideDialog();
            this.messageService.add({severity:'success', summary: 'Completado', detail: 'El Proveedor fue creado con éxito', life:3000});
        }
    }, err =>{
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un problema en el servidor', life: 3000});
    });
  }

  updateData(){
    this.submitted = true;
    this.provider.provider_phone = this.provider.provider_phone?.replace(/ /g, "");
    this.provider.id_user = this.user.id_user;
    this.providerService.updateProvider(this.provider, this.provider.id_provider!)
    .subscribe((response)=>{
        if(response.status == 200 || response.message === "Proveedor actualizado con exito"){
            this.getProviders();
            this.hideDialog();
            this.messageService.add({severity:'success', summary: 'Completado', detail: 'El proveedor fue actualizado con éxito', life: 3000});
        }else if(response.status == 400 || response.status == 500 || response.message === "Ocurrio un error interno en el servidor"){
            this.hideDialog();
            this.messageService.add({severity:'error', summary: 'Error', detail: 'Ocurrio un error', life: 3000});
        }
    }, err =>{
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un problema en el servidor', life: 3000});
    });
  }

  changeIdentification($event : any){
    if($event.value == 1) this.maxLength = 10;
    if($event.value == 2) this.maxLength = 20;
    if($event.value == 3) this.maxLength = 13;
  }

  validateIdentification(){
    if(this.provider.id_identification_type == 1) return this.validateCedula();
    if(this.provider.id_identification_type == 2) return this.validatePasaporte();
    if(this.provider.id_identification_type == 3) return verificarRuc(this.provider.provider_identification!);

    return false;
  }

  validateCedula(){
    this.stateIdentification = true;
    let cedula = this.provider.provider_identification!;
    let firsTwoDigits = parseInt(String(cedula?.slice(0,2)));
    let lastDigit = cedula.slice(9);
    let digits :any = cedula.slice(0,9);
    let resultPar = 0;
    let sumaPar = 0;
    let sumaImpar = 0;
    let total = 0;
    let base = 0;

    if(cedula!?.length < 10) return false;
    if((firsTwoDigits > 0 && firsTwoDigits < 25) || firsTwoDigits == 30){
      for (let i = 0; i < digits!.length; i++) {
        if(i%2 == 0) {
           resultPar = digits[i] * 2;
           if(resultPar > 9){
            resultPar = resultPar - 9;
           }
           sumaPar += resultPar;
        }else{
            sumaImpar += parseInt(digits[i]);
        }
      }

      total = sumaPar + sumaImpar;
      base = ((parseInt(String(sumaPar + sumaImpar).slice(0,1))+1)*10) - total;
      if(lastDigit === String(base)){
          return true;
      }else{
          return false;
      }
    }else{
      return false;
    }
  }

  validatePasaporte(){
    let pasaporte = parseInt(this.provider.provider_identification!);
    if(pasaporte < 14 || pasaporte > 20){
      return false;
    }

    return true;
  }

  editProvider(provider : IProvider){
    this.actionSelected = "edit"
    this.provider = {...provider};
    this.productDialog = true; // abrimos modal
  }

  deleteProvider(provider : IProvider){
    this.confirmationService.confirm({
      message: '¿Estás seguro de inactivar al proveedor: ' + '"'+provider.provider_name + '"'+'?',
      header: 'Inactivar Proveedor',
      acceptLabel : 'Inactivar',
      rejectLabel : 'Cancelar',
      rejectButtonStyleClass: 'p-button-outlined p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.providerService.deleteProvider(provider.id_provider!, this.user.id_user!).subscribe((response)=>{
              if(response.status == 200 || response.message === "Eliminado correctamente"){
                  this.getProviders();
                  this.messageService.add({severity:'success', summary: 'Completado', detail: 'Proveedor Inactivado', life: 3000});
              }
          },(err)=>{
            this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un problema en el servidor', life: 3000});
          });
      }
  });

  }

  exportCSV(){
    this.generateCSVService.generateCSV(this.providers);
  }

  isExistProviderName(){
    this.validationServices.validateProviderName({provider_name: this.provider.provider_name}).subscribe((response)=>{
      if(response.message == "existe"){
        this.messageService.add({severity:'error', summary: 'Error', detail: 'El nombre del proveedor ya existe', life: 3000});
        return ;
      }

      this.isExistProviderIdentification();
    }, err=>{
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un problema en el servidor', life: 3000});
    })
  }

  isExistProviderIdentification(){
    this.validationServices.validateProviderIdentification({provider_identification: this.provider.provider_identification}).subscribe((response)=>{
      if(response.message == "existe"){
        this.messageService.add({severity:'error', summary: 'Error', detail: 'La identificación ingresada ya esta en uso', life: 3000});
        return ;
      }

      this.saveData();
    }, err=>{
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un problema en el servidor', life: 3000});
    })
  }

  validateData(){
    if(
      !this.provider.provider_name ||
      !this.provider.id_identification_type || this.provider.id_identification_type == null ||
      !this.provider.provider_qualified || this.provider.provider_qualified == null ||
      !this.provider.provider_status || this.provider.provider_status == null ||
      !this.provider.id_identification_type || this.provider.id_identification_type == null ||
      !this.provider.provider_identification ||
      !this.provider.provider_address || this.provider.provider_address!.length < 5 ||
      !this.provider.provider_email ||
      !this.provider.provider_products_offered ||
      !this.provider.provider_phone || this.provider.provider_phone.length < 10 ||
      !this.provider.provider_landline ||
      !this.provider.provider_person_name || this.provider.provider_person_name.length < 3 ||
      !this.provider.provider_person_lastName || this.provider.provider_person_lastName.length < 3 ||
      !this.provider.provider_response_time_day || this.provider.provider_response_time_day == null ||
      !this.provider.provider_response_time_hour || this.provider.provider_response_time_hour == null
    )
    {return false}

    return true;
  }

  regexData(email : string){
    let regexEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

     return regexEmail.test(email);
  }
}
