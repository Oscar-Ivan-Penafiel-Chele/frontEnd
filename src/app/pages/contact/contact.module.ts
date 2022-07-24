import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactRoutingModule } from './contact-routing.module';
import { ContactComponent } from './pages/contact.component';
import { ButtonUpModule } from 'src/app/shared/components/button-up/button-up.module';
import { FooterModule } from 'src/app/shared/components/footer/footer.module';
import { NavAboutContactModule } from 'src/app/shared/components/nav-about-contact/nav-about-contact/nav-about-contact.module';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';

@NgModule({
  declarations: [
    ContactComponent
  ],
  imports: [
    CommonModule,
    ContactRoutingModule,
    ButtonUpModule,
    FooterModule,
    NavAboutContactModule,
    PrimengComponentsModule
  ]
})
export class ContactModule { }
