import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OrderComponent } from './order.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes : Routes = [
  { path:'', component: OrderComponent, data: {role : 5}, canActivate : [AuthGuard],
    children : [
      {path: '', redirectTo: 'personal', pathMatch : 'full'},
      {path: 'personal', loadChildren : ()=> import('./personal/personal.module').then( m => m.PersonalModule)},
      {path: 'payment', loadChildren : ()=> import('./payment/payment.module').then( m => m.PaymentModule)},
      {path: 'confirmation', loadChildren : ()=> import('./confirmation/confirmation.module').then( m => m.ConfirmationModule)},
    ]
  },
  { path:'**' , redirectTo:''}
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports : [ RouterModule ]
})
export class OrderRoutingModule { }