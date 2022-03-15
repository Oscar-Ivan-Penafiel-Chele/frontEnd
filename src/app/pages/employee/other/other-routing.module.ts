import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OtherComponent } from './other.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { IslogGuard } from 'src/app/guards/islog.guard';

const routes : Routes = [
  { path:'', component: OtherComponent, canActivate : [IslogGuard], 
    children : [
      {path: '', redirectTo: 'perfil', pathMatch : 'full'},
      {path : 'perfil' , loadChildren : ()=> import('./profile/profile.module').then( m => m.ProfileModule)},
      {path : 'change-password' , loadChildren : ()=> import('./change-password/change-password.module').then( m => m.ChangePasswordModule)}
    ]
  },
  { path:'**' , redirectTo:''}
]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports : [RouterModule]
})
export class OtherRoutingModule { }
