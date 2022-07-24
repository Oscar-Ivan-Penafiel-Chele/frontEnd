import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, Routes } from '@angular/router';
import { ReportComponent } from './page/report.component';

const routes : Routes = [
  { path:'', component: ReportComponent},
  { path:'**' , redirectTo:''}
]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports : [RouterModule]
})
export class ReportRoutingModule { }
