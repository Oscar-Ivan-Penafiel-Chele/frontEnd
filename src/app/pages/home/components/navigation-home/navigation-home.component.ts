import { Component, OnInit } from '@angular/core';
import { NavigationItem } from '@models/interfaces';
import { HomeService } from '../../service/home.service';

@Component({
  selector: 'app-navigation-home',
  templateUrl: './navigation-home.component.html',
  styleUrls: ['./navigation-home.component.css']
})
export class NavigationHomeComponent implements OnInit {
  itemNavigation : NavigationItem [] = [];

  constructor( private _homeService : HomeService,) { }

  ngOnInit(): void {
    this.getAllItemNavigation();
  }

  getAllItemNavigation(){
    this._homeService.getAllItemNavigation()
    .subscribe((response) =>{
      this.itemNavigation = response;
    });
  }

  isActive(){
    const iconBurger = document.querySelector('.icon-burger');
    iconBurger?.classList.toggle("active");
  }


}
