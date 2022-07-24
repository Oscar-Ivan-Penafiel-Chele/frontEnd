import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './pages/about.component';

const routes : Routes = [
  { path:'', component: AboutComponent, pathMatch : 'full'},
  { path:'**' , redirectTo:''}
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports : [RouterModule],
})
export class AboutRoutingModule { }
