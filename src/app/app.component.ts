import { Component, OnInit } from '@angular/core';
import { BnNgIdleService } from 'bn-ng-idle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'frontEnd';

  constructor(private bnIdle: BnNgIdleService){}

  ngOnInit(){
  }
}
