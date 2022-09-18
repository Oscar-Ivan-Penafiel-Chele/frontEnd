import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecoveryPasswordGuard } from 'src/app/auth/guards/recovery-password.guard';
import { RecoverPasswordComponent } from './page/recover-password.component';

const routes: Routes = [
  { path:'', component: RecoverPasswordComponent, pathMatch : 'full', canActivate: [RecoveryPasswordGuard]},
  { path:'**' , redirectTo:''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecoveryPasswordRoutingModule { }
