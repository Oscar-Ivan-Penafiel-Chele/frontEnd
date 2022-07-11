import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressRoutingModule } from './address-routing.module';
import { AddressUserComponent } from './page/address-user.component';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {ToolbarModule} from 'primeng/toolbar';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ToastModule} from 'primeng/toast';
import {DialogModule} from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import {DropdownModule} from 'primeng/dropdown';
import {RadioButtonModule} from 'primeng/radiobutton';


@NgModule({
  declarations: [
    AddressUserComponent
  ],
  imports: [
    CommonModule,
    AddressRoutingModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    ToolbarModule,
    ConfirmDialogModule,
    ToastModule,
    DialogModule,
    FormsModule,
    DropdownModule,
    RadioButtonModule
  ]
})
export class AddressModule { }
