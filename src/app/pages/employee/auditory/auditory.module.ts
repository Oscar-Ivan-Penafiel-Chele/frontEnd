import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditoryComponent } from './auditory.component';
import { AuditoryRoutingModule } from './auditory-routing.module';


@NgModule({
  declarations: [
    AuditoryComponent
  ],
  imports: [
    CommonModule,
    AuditoryRoutingModule,
  ]
})
export class AuditoryModule { }
