import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Message, MessageService, PrimeNGConfig } from 'primeng/api';
import { User } from 'src/app/models/user';
import { RestService } from 'src/app/services/rest.service';
import { TokenService } from 'src/app/services/token.service';

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
    private _rest : RestService,
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

  upLoadFile($event : any){
    const fileExcel = new FormData();
    fileExcel.append('excel',$event.files[0]);
    fileExcel.append('id_user',String(this.user.id_user));
    
    this._rest.uploadStock(fileExcel).subscribe((response : any)=>{
        this.overlay = true;
        if(response.status == 200 || response.message === "Excel subido con exito"){
          this.messageService.add({severity:'success', summary: 'Completado', detail: 'Archivo subido con éxito', life: 3000});
          this.overlay = false;
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }else if(response.status == 500 || response.message === "Ocurrio un error interno en el servidor"){
          this.overlay = false;
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Ocurrio un error interno en el servidor', life: 3000});
        }
    })
  }
}
