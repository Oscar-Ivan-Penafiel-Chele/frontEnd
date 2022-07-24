import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageIvaRoutingModule } from './manage-iva-routing.module';
import { ManageIvaComponent } from './page/manage-iva.component';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';

@NgModule({
  declarations: [
    ManageIvaComponent
  ],
  imports: [
    CommonModule,
    ManageIvaRoutingModule,
    PrimengComponentsModule
  ]
})
export class ManageIvaModule { }
