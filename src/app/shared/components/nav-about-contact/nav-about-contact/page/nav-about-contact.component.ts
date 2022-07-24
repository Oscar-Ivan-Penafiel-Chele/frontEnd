import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-simple',
  templateUrl: './nav-about-contact.component.html',
  styleUrls: ['./nav-about-contact.component.css']
})
export class NavAboutContactComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  isActive(){
    const iconBurger = document.querySelector('.icon-burger');
    iconBurger?.classList.toggle("active");
  }
}
