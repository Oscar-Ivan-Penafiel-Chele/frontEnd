import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { BnNgIdleService } from 'bn-ng-idle';
import { TokenService } from 'src/app/auth/service/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-overlay-inactivity',
  templateUrl: './overlay-inactivity.component.html',
  styleUrls: ['./overlay-inactivity.component.css']
})
export class OverlayInactivityComponent implements OnInit {
  iconExclamation: string = "../../../assets/img/icon _exclamation.svg";
  isShowModal: boolean = false;


  constructor(
    private primeNGConfig: PrimeNGConfig, 
    private bnIdle: BnNgIdleService, 
    private tokenService: TokenService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.primeNGConfig.ripple = true;
    this.isInactivity();
  }

  isInactivity(){
    this.bnIdle.startWatching(1740).subscribe((isTimedOut: boolean) => {
      if(!this.tokenService.getTokenDataUser()) return ;
      
      if (isTimedOut) {
        this.isShowModal = true;
        localStorage.clear();
      }
    });
  }

  redirect(){
    this.router.navigate(['/login']);
    this.isShowModal = false;
  }
}
