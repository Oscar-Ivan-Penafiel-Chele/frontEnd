import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendedorPedidosComponent } from './vendedor-pedidos.component';
import { VendedorPedidosRoutingModule } from './vendedor-pedidos-routing.module';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ToastModule} from 'primeng/toast';
import {ToolbarModule} from 'primeng/toolbar';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {CheckboxModule} from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import {RadioButtonModule} from 'primeng/radiobutton';
import {TooltipModule} from 'primeng/tooltip';
import {DialogModule} from 'primeng/dialog';

@NgModule({
  declarations: [
    VendedorPedidosComponent
  ],
  imports: [
    CommonModule,
    VendedorPedidosRoutingModule,
    ProgressSpinnerModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule,
    ToolbarModule,
    OverlayPanelModule,
    CheckboxModule,
    FormsModule,
    RadioButtonModule,
    TooltipModule,
    DialogModule
  ]
})
export class VendedorPedidosModule { }
