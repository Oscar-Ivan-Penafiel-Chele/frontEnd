import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatisticsPurchaseComponent } from './page/statistics-purchase.component';

const routes: Routes = [
  { path:'', component: StatisticsPurchaseComponent},
  { path:'**' , redirectTo:''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticsPurchaseRoutingModule { }
