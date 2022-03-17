import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesmanComponent } from './salesman.component';
import { SalesmanRoutingModule } from './salesman-routing.module';
import {TooltipModule} from 'primeng/tooltip';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {ConfirmDialogModule} from 'primeng/confirmdialog';

@NgModule({
  declarations: [
    SalesmanComponent,
  ],
  imports: [
    CommonModule,
    SalesmanRoutingModule,
    TooltipModule,
    ProgressSpinnerModule,
    ScrollPanelModule,
    ConfirmDialogModule
  ]
})
export class SalesmanModule { }
