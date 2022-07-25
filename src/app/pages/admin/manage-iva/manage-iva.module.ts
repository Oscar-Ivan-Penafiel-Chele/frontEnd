import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageIvaRoutingModule } from './manage-iva-routing.module';
import { ManageIvaComponent } from './page/manage-iva.component';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';
import { ModalManageIvaComponent } from './components/modal-manage-iva/modal-manage-iva.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ManageIvaComponent,
    ModalManageIvaComponent
  ],
  imports: [
    CommonModule,
    ManageIvaRoutingModule,
    PrimengComponentsModule,
    FormsModule
  ]
})
export class ManageIvaModule { }
