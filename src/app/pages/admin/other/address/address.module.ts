import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressRoutingModule } from './address-routing.module';
import { AddressUserComponent } from './page/address-user.component';
import { FormsModule } from '@angular/forms';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';

@NgModule({
  declarations: [
    AddressUserComponent
  ],
  imports: [
    CommonModule,
    AddressRoutingModule,
    FormsModule,
    PrimengComponentsModule
  ]
})
export class AddressModule { }
