import { Component, OnInit } from '@angular/core';
import { Auditory } from 'src/app/models/auditory';
import { RestService } from 'src/app/services/rest.service';
// import Airtm from "@dinels/airtm";
import { environment } from 'src/environments/environment.prod';

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

  // async exportPdf(){
  //   const airtm = new Airtm({
  //     clientKey: environment.AIRTM_API_KEY, // Airtm Key
  //     clientSecret: environment.AIRTM_API_SECRET, // Airtm secret
  //     clientEnv: "production", // sandbox or production
  //   });

  //   try {
  //     const data = await airtm.getPartnerInformation().then((response)=>{
  //       console.log(response);
  //     }, (error)=>{
  //       console.log(error);
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
    
  //   console.log(data);
  // }

  openModal(auditory : any){
    this.displayModal = true;
    this.aud = {...auditory};
  }

}
