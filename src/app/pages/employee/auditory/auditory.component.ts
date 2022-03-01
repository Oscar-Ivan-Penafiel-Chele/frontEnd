import { Component, OnInit } from '@angular/core';
import { Auditory } from 'src/app/models/auditory';

@Component({
  selector: 'app-auditory',
  templateUrl: './auditory.component.html',
  styleUrls: ['./auditory.component.css']
})
export class AuditoryComponent implements OnInit {

  auditories : Auditory[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  exportPdf(){}

}
