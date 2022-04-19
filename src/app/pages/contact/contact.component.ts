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
    this.delayCharge();
  }

  isActive(){
    const iconBurger = document.querySelector('.icon-burger');
    iconBurger?.classList.toggle("active");
  }

  delayCharge() : any{
    const SET_TIME_OUT_DELAY= 3000;

    setTimeout(() => {
      this.completeCharge = false;
    }, SET_TIME_OUT_DELAY);
  }
}
