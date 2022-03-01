import { Component, OnInit } from '@angular/core';
import { Auditory } from 'src/app/models/auditory';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-auditory',
  templateUrl: './auditory.component.html',
  styleUrls: ['./auditory.component.css']
})
export class AuditoryComponent implements OnInit {

  auditories : any[] = [];
  displayModal : boolean = false;
  aud : any = {};

  constructor(private _rest : RestService) { }

  ngOnInit(): void {
    this.getAuditories();
  }

  getAuditories(){
    this._rest.getAuditories().subscribe((response)=>{
      this.auditories = response;
      console.log(this.auditories);
    });
  }

  exportPdf(){}

  openModal(auditory : any){
    this.displayModal = true;
    this.aud = {...auditory};
  }
}
