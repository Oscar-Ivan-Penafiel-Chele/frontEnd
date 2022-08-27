import { Component, OnInit } from '@angular/core';
import { BnNgIdleService } from 'bn-ng-idle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'frontEnd';

  constructor(private bnIdle: BnNgIdleService){}

  ngOnInit(){
    //this.isInactivity();
  }

  isInactivity(){
    let cont = 0;
    this.bnIdle.startWatching(5).subscribe((isTimedOut: boolean) => {
      if (isTimedOut && cont == 0) {
        console.log('session expired');
        cont = 1;
        return;
      }
    });
  }
}
