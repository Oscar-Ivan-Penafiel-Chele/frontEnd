import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditoryComponent } from './auditory.component';
import { AuditoryRoutingModule } from './auditory-routing.module';
import {TableModule} from 'primeng/table';
import {ToolbarModule} from 'primeng/toolbar';
import {TooltipModule} from 'primeng/tooltip';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';

@NgModule({
  declarations: [
    AuditoryComponent
  ],
  imports: [
    CommonModule,
    AuditoryRoutingModule,
    TableModule,
    ToolbarModule,
    TooltipModule,
    ButtonModule,
    InputTextModule
  ]
})
export class AuditoryModule { }
