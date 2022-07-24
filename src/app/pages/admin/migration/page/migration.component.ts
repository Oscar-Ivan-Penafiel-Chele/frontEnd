import { Component, OnInit } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { TokenService } from 'src/app/auth/service/token.service';
import { User } from '@models/interfaces';
import { MigrationService } from '../service/migration.service';

@Component({
  selector: 'app-migration',
  templateUrl: './migration.component.html',
  styleUrls: ['./migration.component.css'],
  providers : [MessageService]
})
export class MigrationComponent implements OnInit {

  uploadedFiles: any[] = [];
  invalidFileTypeMessageSummary : string = `Tipo de archivo inválido:`;
  invalidFileTypeMessageDetail : string = `Tipo de archivo permitido: .xls y .csv`;
  user : User = {};
  visible : boolean = false;
  imageExcel = "assets/img/IconExcel.svg";
  descriptionSize : string = "";
  progress : number = 0;
  overlay : boolean = false;

  constructor(
    private messageService: MessageService,
    private _token : TokenService,
    private migrationService : MigrationService,
  ) { }

  ngOnInit(): void {
    this.getDataProfile();
  }

  getDataProfile(){
    const data = this._token.getTokenDataUser() as string;
    this.user = JSON.parse(data);
  }

  onUpload($event:any){
    this.visible = true;
    if($event.files[0].size < 1048576){
        this.descriptionSize = "kb";
    }else if($event.files[0].size >= 1048576){
        this.descriptionSize = "mb";
    }
  } 

  upLoadFile($event : any, form : FileUpload){
    this.overlay = true;
    const fileExcel = new FormData();
    fileExcel.append('excel',$event.files[0]);
    fileExcel.append('id_user',String(this.user.id_user));
    
    this.migrationService.uploadStock(fileExcel).subscribe((response : any)=>{
      console.log(response);
        if(response.status === "200"){
          this.overlay = false;
          this.messageService.add({severity:'success', summary: 'Completado', detail: `${response.message}`, life: 4000});
          form.clear();
          form.uploadedFileCount = 0;
        }else if(response.status === "500"){
          this.overlay = false;
          this.messageService.add({severity:'error', summary: 'Error', detail: `${response.message}`, life: 6000});
          form.clear();
          form.uploadedFileCount = 0;
        }else if(response.status === "401"){
          this.overlay = false;
          this.messageService.add({severity:'error', summary: 'Error', detail: `${response.message}`, life: 6000});
          form.clear();
          form.uploadedFileCount = 0;
        }
    })
  }
}
