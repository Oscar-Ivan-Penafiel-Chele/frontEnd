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
  loading : boolean = false;

  constructor(private _rest : RestService) { }

  ngOnInit(): void {
    this.getAuditories();
  }

  getAuditories(){
    this.loading = true;
    this._rest.getAuditories().subscribe((response)=>{
      this.auditories = response;
      this.loading = false;
    });
  }

  exportPdf(){}

  openModal(auditory : any){
    this.displayModal = true;
    this.aud = {...auditory};
  }
}
