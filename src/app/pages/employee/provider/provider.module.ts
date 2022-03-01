import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderRoutingModule } from './provider-routing.module';
import { ProviderComponent } from './provider.component';
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
import {InputTextareaModule} from 'primeng/inputtextarea';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputMaskModule} from 'primeng/inputmask';
import {TooltipModule} from 'primeng/tooltip';

@NgModule({
  declarations: [
    ProviderComponent
  ],
  imports: [
    CommonModule,
    ProviderRoutingModule,
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
    InputTextareaModule,
    InputNumberModule,
    InputMaskModule,
    TooltipModule
  ]
})
export class ProviderModule { }
