import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProviderComponent } from './page/provider.component';

const routes : Routes = [
  { path:'', component: ProviderComponent},
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
export class ProviderRoutingModule { }
