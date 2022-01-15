import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  completeCharge: boolean = true;

  constructor(private primengConfig: PrimeNGConfig) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    setTimeout(() => {
      this.completeCharge = false;
    }, 2500);
  }

  isActive(){
    const iconBurger = document.querySelector('.icon-burger');
    iconBurger?.classList.toggle("active");
  }

  scrollDown(){
    let pageHeight = window.innerHeight;
    window.scrollBy(0, pageHeight)
  }
}
