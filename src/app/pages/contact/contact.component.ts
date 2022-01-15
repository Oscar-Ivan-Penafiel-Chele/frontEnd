import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
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
}
