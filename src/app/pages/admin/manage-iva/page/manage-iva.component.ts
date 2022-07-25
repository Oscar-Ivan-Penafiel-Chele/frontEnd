import { Component, OnInit } from '@angular/core';
import { IManageIVA } from '@models/interfaces';
import { ManageIvaService } from '../service/manage-iva.service';

@Component({
  selector: 'app-manage-iva',
  templateUrl: './manage-iva.component.html',
  styleUrls: ['./manage-iva.component.css']
})
export class ManageIvaComponent implements OnInit {

  isLoading : boolean = true;
  data : IManageIVA[] = [];
  displayModal : boolean = false;
  manageIva : IManageIVA = {} as IManageIVA;
  submitted : boolean = false;

  constructor(private manageIvaService : ManageIvaService) { }

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
      console.log(response);
      this.displayModal = false;
      this.isLoading = true;
      this.getIva();
    })
  }

  openModal( iva : IManageIVA){
    this.displayModal = true;
    this.manageIva = {...iva};
  }
}
