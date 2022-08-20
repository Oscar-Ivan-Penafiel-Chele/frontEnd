import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecoverPasswordGuard } from 'src/app/auth/guards/recover-password.guard';
import { RecoverPasswordComponent } from './page/recover-password.component';

const routes: Routes = [
  { path:'', component: RecoverPasswordComponent, pathMatch : 'full', canActivate: [RecoverPasswordGuard]},
  { path:'**' , redirectTo:''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecoveryPasswordRoutingModule { }
