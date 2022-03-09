import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-egresos',
  templateUrl: './egresos.component.html',
  styleUrls: ['./egresos.component.css']
})
export class EgresosComponent implements OnInit {

  egresos : any;
  loading : boolean = false;
  
  constructor() { }

  ngOnInit(): void {
  }

}
