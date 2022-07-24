import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandRoutingModule } from './brand-routing.module';
import { BrandComponent } from './page/brand.component';
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
import {TooltipModule} from 'primeng/tooltip';

@NgModule({
  declarations: [
    BrandComponent
  ],
  imports: [
    CommonModule,
    BrandRoutingModule,
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
    TooltipModule
  ]
})
export class BrandModule { }
