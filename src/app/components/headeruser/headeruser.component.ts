import { Component, Host, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { ShopComponent } from 'src/app/pages/user/shop/shop.component';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-headeruser',
  templateUrl: './headeruser.component.html',
  styleUrls: ['./headeruser.component.css']
})
export class HeaderuserComponent implements OnInit {

  overlayLogout : boolean = false;
  fechaYHora : any ;
  user : User = {};
  isLogged?: boolean = false;

  constructor( 
    private _token : TokenService, 
    private _authService : AuthService,
    private _navigate : Router,
    ) { }

  ngOnInit(): void {
    
  }

  
}
