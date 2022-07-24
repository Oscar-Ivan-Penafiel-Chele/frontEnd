import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/page/dashboard.component';
import {TooltipModule} from 'primeng/tooltip';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {ConfirmDialogModule} from 'primeng/confirmdialog';

@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    TooltipModule,
    ProgressSpinnerModule,
    ScrollPanelModule,
    ConfirmDialogModule
  ]
})
export class AdminModule { }
