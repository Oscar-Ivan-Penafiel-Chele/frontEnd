import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartsRoutingModule } from './charts-routing.module';
import { ChartsComponent } from './charts.component';
import {ChartModule} from 'primeng/chart';
import {RippleModule} from 'primeng/ripple';
import {SkeletonModule} from 'primeng/skeleton';

@NgModule({
  declarations: [
    ChartsComponent
  ],
  imports: [
    CommonModule,
    ChartsRoutingModule,
    ChartModule,
    RippleModule,
    SkeletonModule
  ]
})
export class ChartsModule { }
