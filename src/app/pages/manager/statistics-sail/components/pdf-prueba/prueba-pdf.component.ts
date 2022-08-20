import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-prueba-pdf',
  templateUrl: './prueba-pdf.component.html',
  styleUrls: ['./prueba-pdf.component.css']
})
export class PruebaPdfComponent implements OnInit {
  @Input()  dataSails: any[] = [];;
  constructor() { }

  ngOnInit(): void {
  }

}
