import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReportSailComponent } from './report-sail.component';

const routes: Routes = [
  { path:'', component: ReportSailComponent},
  { path:'**' , redirectTo:''}
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports : [RouterModule]
})
export class ReportSailRoutingModule { }
