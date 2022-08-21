import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermsRoutingModule } from './terms-routing.module';
import { TermsComponent } from './page/terms.component';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';
import { FooterModule } from 'src/app/shared/components/footer/footer.module';
import { NavAboutContactModule } from 'src/app/shared/components/nav-about-contact/nav-about-contact/nav-about-contact.module';
import { ButtonUpModule } from 'src/app/shared/components/button-up/button-up.module';

@NgModule({
  declarations: [
    TermsComponent
  ],
  imports: [
    CommonModule,
    TermsRoutingModule,
    PrimengComponentsModule,
    FooterModule,
    NavAboutContactModule,
    ButtonUpModule
  ]
})
export class TermsModule { }
