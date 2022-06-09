import { Component, Host, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShopComponent } from 'src/app/pages/user/shop/shop.component';

@Component({
  selector: 'app-overlay-login',
  templateUrl: './overlay-login.component.html',
  styleUrls: ['./overlay-login.component.css']
})
export class OverlayLoginComponent implements OnInit {

  displayOverlay : boolean = true;
  hideOverlay : boolean = false;

  constructor(
    @Host() private _overlay : ShopComponent,
    private _router : Router
    ) { }

  ngOnInit(): void {
  }

  goLogin(){
    this._router.navigate(['login'])
  }

  goSignup(){
    this._router.navigate(['signup'])
  }

  resetOverlay(){
    this._overlay.showOverlayLogin = false;
  }

}
