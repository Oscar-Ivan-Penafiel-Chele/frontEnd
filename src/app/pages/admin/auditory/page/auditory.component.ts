import { Component, OnInit } from '@angular/core';
import { Auditory } from '@models/interfaces';
import { Table } from 'primeng/table';
import { AuditoryService } from '../service/auditory.service';
import { PrimeNGConfig ,ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-auditory',
  templateUrl: './auditory.component.html',
  styleUrls: ['./auditory.component.css'],
  providers : [MessageService,ConfirmationService]
})
export class AuditoryComponent implements OnInit {

  auditories : Auditory[] = [];
  auditoriesAux: Auditory[] = [];
  displayModal : boolean = false;
  options: any[] = [];
  optionsActions: any[] = [];
  aud : any = {};
  loading : boolean = false;
  selectedModules: string[] = [];
  selectedActions: string[] = [];

  constructor(
    private auditoryService : AuditoryService, 
    private confirmationService: ConfirmationService,
    private messageService: MessageService, ) { }

  ngOnInit(): void {
    this.getAuditories();
  }

  getAuditories(): void{
    this.loading = true;
    this.auditoryService.getAuditories().subscribe((response: Auditory[])=>{
      this.auditories = Object.values(response);
      this.auditoriesAux = this.auditories;
      this.loading = false;
      this.handleOptions(this.auditories);
      this.handleOptionsActions(this.auditories);
    }, err => {
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un problema en el servidor', life:3000});
    });
  }

  openModal(auditory : any): void{
    this.displayModal = true;
    this.aud = {...auditory};
  }

  handleOptions(auditories: Auditory[]): void{
   let hash: any = {}; 
   this.options = auditories.filter(i => hash[i.audit_module] ? false : hash[i.audit_module] = true);
  }

  handleOptionsActions(auditories: Auditory[]): void{
    let hash: any = {}; 
    this.optionsActions = auditories.filter(i => hash[i.audit_action] ? false : hash[i.audit_action] = true);
  }

  filterModule(value?: string[]){
    this.selectedModules = value!;

    if(value?.length == 0 && this.selectedActions.length == 0){
        this.auditories = this.auditoriesAux; 
        return;
    }else if(value?.length != 0 && this.selectedActions.length == 0){
      this.auditories = this.auditoriesAux.filter(i => value!.includes(i.audit_module));
      return;
    }else if(value?.length != 0 && this.selectedActions.length != 0){
      this.auditories = this.auditoriesAux.filter(i => value!.includes(i.audit_module) && this.selectedActions.includes(i.audit_action));
      return;
    }else if(value?.length == 0 && this.selectedActions.length != 0){
      this.auditories = this.auditoriesAux.filter(i => this.selectedActions.includes(i.audit_action));
    }
  }

  filterAction(value?: string[]){
    this.selectedActions = value!;

    if(value?.length == 0 && this.selectedModules.length == 0){
      this.auditories = this.auditoriesAux; 
      return;
    }else if(value?.length != 0 && this.selectedModules.length == 0){
      this.auditories = this.auditoriesAux.filter(i => value!.includes(i.audit_action));
    }else if(value?.length != 0 && this.selectedModules.length != 0){
      this.auditories = this.auditoriesAux.filter(i => value!.includes(i.audit_action) && this.selectedModules.includes(i.audit_module));
      return;
    }else if(value?.length == 0 && this.selectedModules.length != 0){
      this.auditories = this.auditoriesAux.filter(i => this.selectedModules.includes(i.audit_module));
      return;
    }
  }

  clear(table: Table) {
    this.selectedModules = [];
    this.selectedActions = [];
    this.auditories = this.auditoriesAux;  
  }
}
