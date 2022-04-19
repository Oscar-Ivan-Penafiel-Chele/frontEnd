import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scroll-to-up',
  templateUrl: './scroll-to-up.component.html',
  styleUrls: ['./scroll-to-up.component.css']
})
export class ScrollToUpComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.buttonBackUp();
  }

  buttonBackUp(){
    window.addEventListener("scroll",this.scrollFunction);
  }

  scrollFunction(){
    const SET_TIME_OUT = 250;
    const backToTopButton : any = document.querySelector('#back-up');

    if (window.pageYOffset > 300) { // Show backToTopButton
      if(!backToTopButton.classList.contains("btnEntrance")) {
        backToTopButton.classList.remove("btnExit");
        backToTopButton.classList.add("btnEntrance");
        backToTopButton.style.display = "block";
      }
    }
    else { // Hide backToTopButton
      if(backToTopButton.classList.contains("btnEntrance")) {
        backToTopButton.classList.remove("btnEntrance");
        backToTopButton.classList.add("btnExit");
        setTimeout(function() {
          backToTopButton.style.display = "none";
        },SET_TIME_OUT);
      }
    }

    backToTopButton.addEventListener("click", () => {
      window.scrollTo(0,0);
    });
  }
}
