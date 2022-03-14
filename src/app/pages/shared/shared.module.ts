import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollToUpComponent } from 'src/app/components/scroll-to-up/scroll-to-up.component';
import { FooterShopComponent } from 'src/app/components/footer-shop/footer-shop.component';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';

@NgModule({
  declarations: [
    ScrollToUpComponent,
    FooterShopComponent
  ],
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    InputTextModule,
    ButtonModule
  ],
  exports : [
    ScrollToUpComponent,
    FooterShopComponent,
  ]
  
})
export class SharedModule { }
