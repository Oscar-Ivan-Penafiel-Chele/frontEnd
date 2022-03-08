import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromoRoutingModule } from './promo-routing.module';
import { PromoComponent } from './promo.component';
import {TableModule} from 'primeng/table';
import {ToolbarModule} from 'primeng/toolbar';
import {ToastModule} from 'primeng/toast';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import { FormsModule } from '@angular/forms';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {DialogModule} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {CheckboxModule} from 'primeng/checkbox';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {InputNumberModule} from 'primeng/inputnumber';
import {CalendarModule} from 'primeng/calendar';

@NgModule({
  declarations: [
    PromoComponent
  ],
  imports: [
    CommonModule,
    PromoRoutingModule,
    TableModule,
    ToolbarModule,
    ToastModule,
    InputTextModule,
    FormsModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    DropdownModule,
    OverlayPanelModule,
    CheckboxModule,
    InputTextareaModule,
    AutoCompleteModule,
    InputNumberModule,
    CalendarModule
  ]
})
export class PromoModule { }
