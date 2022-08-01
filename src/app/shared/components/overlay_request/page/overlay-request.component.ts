import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-overlay-request',
  templateUrl: './overlay-request.component.html',
  styleUrls: ['./overlay-request.component.css']
})
export class OverlayRequestComponent implements OnInit {

  @Input() showOverlay: boolean = false;
  @Input() loadRequest: boolean = false;
  @Input() textOverlay: string = "";
  @Input() textResponse: string = "";
  @Input() url: string = "";
  @Input() showButtons : boolean = false;
  @Input() showButtonDynamic : boolean = false;
  @Input() iconResponse : string = "";
  @Input() textButton : string = "";
  @Input() iconButton : string = "";
  @Input() productsError : any[] = [];

  constructor(private router : Router) { }

  ngOnInit(): void {
  }

  goHome(){
    this.router.navigate(['/shop']);
  }

  redirection(){
    this.router.navigate([this.url]);
  }
}
