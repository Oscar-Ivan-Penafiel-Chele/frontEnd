import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MigrationComponent } from './page/migration.component';

const routes : Routes = [
  { path:'', component: MigrationComponent},
  { path:'**' , redirectTo:''}
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports : [RouterModule]
})
export class MigrationRoutingModule { }
