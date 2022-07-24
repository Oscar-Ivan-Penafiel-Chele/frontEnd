import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageIvaRoutingModule } from './manage-iva-routing.module';
import { ManageIvaComponent } from './page/manage-iva.component';
import {TableModule} from 'primeng/table';


@NgModule({
  declarations: [
    ManageIvaComponent
  ],
  imports: [
    CommonModule,
    ManageIvaRoutingModule,
    TableModule
  ]
})
export class ManageIvaModule { }
