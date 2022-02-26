import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report.component';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {CheckboxModule} from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import {TableModule} from 'primeng/table';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {DropdownModule} from 'primeng/dropdown';
import {DialogModule} from 'primeng/dialog';
import {ToolbarModule} from 'primeng/toolbar';
import {ToastModule} from 'primeng/toast';
import {InputTextModule} from 'primeng/inputtext';
import {KeyFilterModule} from 'primeng/keyfilter';
import {PasswordModule} from 'primeng/password';
import {DividerModule} from 'primeng/divider';
import {InputMaskModule} from 'primeng/inputmask';

@NgModule({
  declarations: [
    ReportComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    OverlayPanelModule,
    CheckboxModule,
    FormsModule,
    TableModule,
    ConfirmDialogModule,
    DropdownModule,
    DialogModule,
    ToolbarModule,
    ToastModule,
    InputTextModule,
    KeyFilterModule,
    PasswordModule,
    DividerModule,
    InputMaskModule,
  ]
})
export class ReportModule { }
