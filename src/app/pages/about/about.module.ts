import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';

import { AboutComponent } from './pages/about.component';
import { NavAboutContactModule } from 'src/app/shared/components/nav-about-contact/nav-about-contact/nav-about-contact.module';
import { FooterModule } from 'src/app/shared/components/footer/footer.module';
import { ButtonUpModule } from 'src/app/shared/components/button-up/button-up.module';

@NgModule({
  declarations: [
    AboutComponent,
  ],
  imports: [
    CommonModule,
    AboutRoutingModule,
    NavAboutContactModule,
    FooterModule,
    ButtonUpModule
  ]
})

export class AboutModule { }
