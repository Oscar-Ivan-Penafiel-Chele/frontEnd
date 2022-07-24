import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './pages/contact.component';

const routes : Routes = [
  { path:'', component: ContactComponent, pathMatch : 'full'},
  { path:'**' , redirectTo:''}
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports : [RouterModule],
})
export class ContactRoutingModule { }
