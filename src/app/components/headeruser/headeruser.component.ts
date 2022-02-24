import { Component, Host, OnInit } from '@angular/core';
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
    @Host() private _shop : ShopComponent,
    ) { }

  ngOnInit(): void {
    this.isLog();
    setInterval(()=>{
      this.getDateToday();
    },100); 
  }

  isLog(){
    if(!this._token.getTokenDataUser()){
      return ;
    }

    this.user = JSON.parse(this._token.getTokenDataUser()!);
    this.isLogged = true;
  }

  displayOptions(){
    const menu = document.querySelector('.nav__user');
    const menuOptions = document.querySelector('.nav__user__option');

    if(menuOptions?.classList.contains('isActiveNavOption')){
      menu?.classList.add('isActiveNavUser');
      menuOptions.classList.remove('isActiveNavOption');
    }else{
      menu?.classList.remove('isActiveNavUser');
      menuOptions?.classList.add('isActiveNavOption');
    }
  }

  isActive(){
    const hamburger =  document.querySelector('.hamburger');
    const menu = document.querySelector('.nav__menu');
    const content = document.querySelector('.content-main');

    hamburger?.classList.toggle('is-active');
    menu?.classList.toggle('display');
    
    // if(menu?.classList.contains("display")){
    //  content?.addEventListener('click',function(e){
    //      let isClickInside = menu.contains(e.target as Node);

    //      if(!isClickInside){
    //        console.log("Fuera");
    //        hamburger?.classList.remove("is-active"); 
    //        menu.classList.remove('display');  
    //      }
    //  })
    // }
  }

  getDateToday(){
    let hoy = new Date();

    let fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear();
    let hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();

    this.fechaYHora = fecha + ' ' + hora;

  }

  logOut(){
    this._shop.overlayLogout = true;
    this._authService.logout(this.user.id_user!)
      .subscribe((response)=>{
        if(response.status == 200 || response.message === "Sesión cerrada con éxito"){
          this._token.removeToken();
          window.location.href = '/shop';
      }
    });
  }
}
