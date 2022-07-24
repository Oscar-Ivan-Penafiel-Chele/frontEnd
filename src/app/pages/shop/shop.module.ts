import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopRoutingModule } from './shop-routing.module';
import { ShopComponent } from './page/shop.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';
import { ButtonUpModule } from 'src/app/shared/components/button-up/button-up.module';
import { FooterModule } from 'src/app/shared/components/footer/footer.module';
import { OverlayLoginModule } from './components/overlay-login/overlay-login.module';


@NgModule({
  declarations: [
    ShopComponent,
  ],
  imports: [
    CommonModule,
    ShopRoutingModule,
    FormsModule,
    RouterModule,
    OverlayLoginModule,
    PrimengComponentsModule,
    ButtonUpModule,
    FooterModule
  ]
})
export class ShopModule { }
