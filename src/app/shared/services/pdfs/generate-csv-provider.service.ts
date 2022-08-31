import { Injectable } from '@angular/core';
import { IProvider } from '@models/interfaces';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';

@Injectable({
  providedIn: 'root'
})
export class GenerateCsvProviderService {
  dataCVS : any[] = [];

  constructor() { }

  generateCSV(providers: IProvider[]){
    const fecha = new Date();
    const headers = Object.keys(providers[0]);
    let dataNow = (fecha.getFullYear() < 10 ? '0'+fecha.getFullYear() : fecha.getFullYear())+"-"+((fecha.getMonth()+1) < 10 ? '0'+(fecha.getMonth()+1) : (fecha.getMonth()+1))+"-"+ (fecha.getDate() < 10 ? '0'+fecha.getDate() : fecha.getDate())+" "+(fecha.getHours() < 10 ? '0'+fecha.getHours() : fecha.getHours())+":"+(fecha.getMinutes() < 10 ? '0'+fecha.getMinutes() : fecha.getMinutes())+":"+(fecha.getSeconds() < 10 ? '0'+fecha.getSeconds() : fecha.getSeconds());

    const options = { 
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true, 
        useBom: true,
        headers: headers,
        useHeader: false,
        nullToEmptyString: true,
      };

    this.dataCVS = providers.map((i)=>{
        return i;
    })

    new AngularCsv(this.dataCVS, `${dataNow} Proveedores`, options);
  }
}

