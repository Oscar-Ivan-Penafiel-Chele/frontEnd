import { Component, OnInit } from '@angular/core';
import { IManageIVA } from '@models/interfaces';

@Component({
  selector: 'app-manage-iva',
  templateUrl: './manage-iva.component.html',
  styleUrls: ['./manage-iva.component.css']
})
export class ManageIvaComponent implements OnInit {

  isLoading : boolean = false;
  data : IManageIVA[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  editIva( iva : IManageIVA){

  }
}
