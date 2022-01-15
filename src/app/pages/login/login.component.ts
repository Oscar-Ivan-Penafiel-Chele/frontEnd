import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  value4 : string = "";

  constructor(private primengConfig: PrimeNGConfig) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.primengConfig.setTranslation({
      weak : 'Débil',
      medium : 'Bueno',
      strong : 'Excelente',
      passwordPrompt : '',
    });
  }

}
