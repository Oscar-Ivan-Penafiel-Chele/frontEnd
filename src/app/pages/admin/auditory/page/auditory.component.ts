import { Component, OnInit } from '@angular/core';
import { AuditoryService } from '../service/auditory.service';

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

  constructor(private auditoryService : AuditoryService) { }

  ngOnInit(): void {
    this.getAuditories();
  }

  getAuditories(){
    this.loading = true;
    this.auditoryService.getAuditories().subscribe((response)=>{
      this.auditories = response;
      this.loading = false;
    });
  }

  openModal(auditory : any){
    this.displayModal = true;
    this.aud = {...auditory};
  }

}
