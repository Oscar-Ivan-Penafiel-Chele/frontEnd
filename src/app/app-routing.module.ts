import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch : 'full'}, 
  {path: 'home', loadChildren : ()=> import('./pages/home/home.module').then(m => m.HomeModule) }, 
  {path: 'login', loadChildren : ()=> import('./pages/login/login.module').then(m => m.LoginModule) }, 
  {path: 'signup', loadChildren : ()=> import('./pages/signup/signup.module').then(m => m.SignupModule) }, 
  {path: 'contact', loadChildren : ()=> import('./pages/contact/contact.module').then(m => m.ContactModule) }, 
  {path: 'about', loadChildren : ()=> import('./pages/about/about.module').then( m => m.AboutModule)}, 
  {path: 'shop', loadChildren : () => import('./pages/shop/shop.module').then( m => m.ShopModule)}, 
  {path: 'checkout/cart' , loadChildren : ()=> import('./pages/cart/car.module').then( m => m.CarModule)},
  {path: 'checkout/order' , loadChildren : ()=> import('./pages/order/order.module').then( m => m.OrderModule)},
  {path: 'terminos-y-condiciones', loadChildren : () => import('./pages/terms/terms.module').then(m => m.TermsModule)}, 
  {path: 'gerente', loadChildren : ()=> import('./pages/manager/admin.module').then( m => m.AdminModule)},
  {path: 'administrador', loadChildren : () => import('./pages/admin/employee.module').then( m => m.EmployeeModule)},
  {path: 'vendedor', loadChildren : () => import('./pages/salesman/salesman.module').then( m => m.SalesmanModule)},
  {path: 'configuración', loadChildren : () => import('./pages/admin/other/other.module').then( m => m.OtherModule)},
  {path: 'my-orders', loadChildren : () => import('./pages/pedidos/pedidos.module').then( m => m.PedidosModule)},
  {path: 'forget-password', loadChildren : () => import('./pages/forget-password/forget-password.module').then( m => m.ForgetPasswordModule)},
  {path: 'recovery-password', loadChildren : () => import('./pages/recovery-password/recovery-password.module').then( m => m.RecoveryPasswordModule)},
  {path: '**', redirectTo: 'home', pathMatch : 'full'}, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
