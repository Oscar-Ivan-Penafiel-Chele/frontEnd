import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EgresosComponent } from './page/egresos.component';
import { EgresosRoutingModule } from './egresos-routing.module';
import {TableModule} from 'primeng/table';
import {ToolbarModule} from 'primeng/toolbar';
import {TooltipModule} from 'primeng/tooltip';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {DialogModule} from 'primeng/dialog';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {DropdownModule} from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import {CalendarModule} from 'primeng/calendar';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {InputNumberModule} from 'primeng/inputnumber';
import {ToastModule} from 'primeng/toast';

@NgModule({
  declarations: [
    EgresosComponent
  ],
  imports: [
    CommonModule,
    EgresosRoutingModule,
    TableModule,
    ToolbarModule,
    TooltipModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    ConfirmDialogModule,
    DropdownModule,
    FormsModule,
    CalendarModule,
    InputTextareaModule,
    InputNumberModule,
    ToastModule
  ]
})
export class EgresosModule { }
