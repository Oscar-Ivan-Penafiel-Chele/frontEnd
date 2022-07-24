import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavAboutContactComponent } from './page/nav-about-contact.component';

@NgModule({
  declarations: [
    NavAboutContactComponent
  ],
  imports: [
    CommonModule
  ],
  exports : [
    NavAboutContactComponent
  ]
})
export class NavAboutContactModule { }
