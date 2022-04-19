import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactRoutingModule } from './contact-routing.module';
import { ContactComponent } from './contact.component';
import {SkeletonModule} from 'primeng/skeleton';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {InputTextModule} from 'primeng/inputtext';
import { SharedModule } from '../shared/shared.module';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';

@NgModule({
  declarations: [
    ContactComponent
  ],
  imports: [
    CommonModule,
    ContactRoutingModule,
    SkeletonModule,
    InputTextareaModule,
    InputTextModule,
    SharedModule,
    ButtonModule,
    RippleModule
  ]
})
export class ContactModule { }
