import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-button-up',
  templateUrl: './button-up.component.html',
  styleUrls: ['./button-up.component.css']
})
export class ButtonUpComponent implements OnInit {

  constructor(private primengConfig: PrimeNGConfig) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.buttonBackUp();
  }

  buttonBackUp(){
    window.addEventListener("scroll",this.scrollFunction);
  }

  scrollFunction(){
    const SET_TIME_OUT = 250;
    const backToTopButton : any = document.querySelector('#back-up');

    try {
      if (window.pageYOffset > 300) { // Show backToTopButton
        if(!backToTopButton?.classList.contains("btnEntrance")) {
          backToTopButton?.classList.remove("btnExit");
          backToTopButton?.classList.add("btnEntrance");
          backToTopButton!.style.display = "block";
        }
      }
      else { // Hide backToTopButton
        if(backToTopButton?.classList.contains("btnEntrance")) {
          backToTopButton?.classList.remove("btnEntrance");
          backToTopButton?.classList.add("btnExit");
          setTimeout(function() {
            backToTopButton!.style.display = "none";
          },SET_TIME_OUT);
        }
  
      }
      
      backToTopButton?.addEventListener("click", () => {
        window.scrollTo(0,0);
      });
    } catch (error) {
      
    }
  }
}
