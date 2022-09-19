import { Component, Host, Input, OnInit } from '@angular/core';
import { IManageIVA } from '@models/interfaces';
import { ManageIvaComponent } from '../../page/manage-iva.component';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-modal-manage-iva',
  templateUrl: './modal-manage-iva.component.html',
  styleUrls: ['./modal-manage-iva.component.css']
})
export class ModalManageIvaComponent implements OnInit {
  @Input() displayModal : boolean = false;

  optionsIVA : any[] = [];
  isShowMessageDateInit : boolean = false;
  isShowMessageDateExpiry: boolean = false;
  messageErrorDateInit: string = "";
  messageErrorDateExpiry : string = "";
  submitted : boolean = false;
  manageIva: IManageIVA = {} as IManageIVA;
  status: string = "Activo";

  constructor(
    @Host() private manageIvaComponent : ManageIvaComponent,
    ) {
      this.optionsIVA = [
        {label:'Activo', icon : 'pi pi-check', value : 1},
        {label:'Inactivo', icon : 'pi pi-times', value : 0}
      ];
     }

  ngOnInit(): void {
      this.manageIva.iva_status = 1;
  }

  closeModal(){
    this.manageIvaComponent.displayModal = false;
  }

  updateIva(){
    this.submitted = true;
    if(!this.manageIva.porcent || this.manageIva.porcent == null) return;

    this.manageIvaComponent.submitted = true;
    this.manageIvaComponent.createIva(this.manageIva);
  }

}
