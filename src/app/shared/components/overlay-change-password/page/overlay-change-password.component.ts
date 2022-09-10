import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-overlay-change-password',
  templateUrl: './overlay-change-password.component.html',
  styleUrls: ['./overlay-change-password.component.css']
})
export class OverlayChangePasswordComponent implements OnInit {

  @Input() isLoading : boolean = false;
  @Input() isShow : boolean = false;

  constructor(private primengConfig: PrimeNGConfig, private router : Router) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  redirectLogin(){
    this.router.navigate(['/login']);
  }
}
