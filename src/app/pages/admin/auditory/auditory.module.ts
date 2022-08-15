import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditoryComponent } from './page/auditory.component';
import { AuditoryRoutingModule } from './auditory-routing.module';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AuditoryComponent
  ],
  imports: [
    CommonModule,
    AuditoryRoutingModule,
    PrimengComponentsModule,
    FormsModule
  ]
})
export class AuditoryModule { }
