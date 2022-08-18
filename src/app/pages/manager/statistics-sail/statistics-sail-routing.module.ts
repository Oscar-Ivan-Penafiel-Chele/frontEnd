import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatisticsSailComponent } from './page/statistics-sail.component';

const routes: Routes = [
  { path:'', component: StatisticsSailComponent},
  { path:'**' , redirectTo:''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticsSailRoutingModule { }
