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
  @Input() data : IManageIVA = {} as IManageIVA;
  @Input() displayModal : boolean = false;

  optionsIVA : any[] = [];
  isShowMessageDateInit : boolean = false;
  isShowMessageDateExpiry: boolean = false;
  messageErrorDateInit: string = "";
  messageErrorDateExpiry : string = "";
  submitted : boolean = false;  

  constructor(@Host() private manageIvaComponent : ManageIvaComponent, private config: PrimeNGConfig,) { }

  ngOnInit(): void {
    this.optionsIVA = [
      {label:'Si', icon : 'pi pi-check', value : 1},
      {label:'No', icon : 'pi pi-times', value : 0}
    ];
    this.config.setTranslation({
      "clear" : "Vaciar",
      "today" : "Hoy",
      "dayNamesMin": ["D","L","M","X","J","V","S"],
      "monthNames": ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
    });
  }

  closeModal(){
    this.manageIvaComponent.displayModal = false;
  }

  updateIva(){
    this.manageIvaComponent.submitted = true;
    this.manageIvaComponent.updateIva(this.data);
  }

  getDateNow(){
    let dateNow = new Date();

    let day = (dateNow.getDate()) < 10 ? '0'+(dateNow.getDate()) : dateNow.getDate();;
    let month = (dateNow.getMonth() + 1) < 10 ? '0'+ (dateNow.getMonth() + 1) : dateNow.getMonth() + 1;
    let year = dateNow.getFullYear();
    let date = `${year}-${month}-${day}`;

    return date;
  }

  onSelectDateExpiry($event : any){
    const dateNow = this.getDateNow();
    this.handleDate($event , dateNow, false );
  }

  onSelectDateInit($event : any){
    const dateNow = this.getDateNow();
    this.handleDate($event , dateNow, true );
  }

  handleDate($event : any , dateNow : string , isDateInit : boolean){
    let date = new Date($event);
    let day= (date.getDate()) < 10 ? '0'+(date.getDate()) : date.getDate();
    let month = (date.getMonth() + 1) < 10 ? '0'+ (date.getMonth() + 1) : date.getMonth() + 1;
    let year = date.getFullYear();
    
    let dateSelected = `${year}-${month}-${day}`

    if(dateSelected < dateNow){
      if(isDateInit) this.isShowMessageDateInit = true;
      else this.isShowMessageDateExpiry = true;
    
      return ; 
    }else{
      if(isDateInit) {this.isShowMessageDateInit = false; this.data.date_start = dateSelected;}
      else{ this.isShowMessageDateExpiry = false; this.data.date_end = dateSelected;}
      
      this.validateDatesSelected();
    }
  }

  validateDatesSelected(){
    if(this.data.date_end < this.data.date_start) {
      this.messageErrorDateExpiry = "Fecha de expiración es menor a la fecha de inico" ; 
      this.isShowMessageDateExpiry = true ; 
      this.isShowMessageDateInit = false
      return ;
    }

    if(this.data.date_start > this.data.date_end) {
      this.messageErrorDateInit = "Fecha de inicio es mayor a la fecha de expiración" ; 
      this.isShowMessageDateInit = true ; 
      this.isShowMessageDateExpiry = false
      return ;
    }
  }
}
