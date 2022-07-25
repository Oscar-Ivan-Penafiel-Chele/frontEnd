import { Component, OnInit } from '@angular/core';
import { IManageIVA } from '@models/interfaces';
import { ManageIvaService } from '../service/manage-iva.service';
import {MessageService} from 'primeng/api';

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

  constructor(private manageIvaService : ManageIvaService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.submitted = false;
    this.getIva();
  }

  getIva(){
    this.manageIvaService.getManageIva().subscribe((response : IManageIVA)=>{
      this.data = Object.values(response);
      this.isLoading = false;
    });
  }

  updateIva( iva : IManageIVA){
    console.log(iva)
    this.manageIvaService.updateIva(iva).subscribe((response : any)=>{
      if(response.status == 200 && response.message == "Iva actualizado con éxito"){
        this.getIva();
        this.messageService.add({severity:'success', summary: 'Completado', detail: `${response.message}`, life : 3000});
      }else if(response.status >= 400 ){
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un problema en el servidor', life : 3000});
      }

      this.displayModal = false;
      this.isLoading = true;
    })
  }

  openModal( iva : IManageIVA){
    this.displayModal = true;
    this.manageIva = {...iva};
  }
}
