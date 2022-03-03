import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch : 'full'}, 
  {path: 'home', loadChildren : ()=> import('./pages/home/home.module').then(m => m.HomeModule) }, 
  {path: 'login', loadChildren : ()=> import('./pages/login/login.module').then(m => m.LoginModule) }, 
  {path: 'signup', loadChildren : ()=> import('./pages/signup/signup.module').then(m => m.SignupModule) }, 
  {path: 'contact', loadChildren : ()=> import('./pages/contact/contact.module').then(m => m.ContactModule) }, 
  {path: 'about', loadChildren : ()=> import('./pages/about/about.module').then( m => m.AboutModule)}, 
  {path: 'shop', loadChildren : () => import('./pages/user/shop/shop.module').then( m => m.ShopModule)}, 
  {path: 'checkout/cart' , loadChildren : ()=> import('./pages/car/car.module').then( m => m.CarModule)},
  {path: 'terminos-y-condiciones', loadChildren : () => import('./pages/terms/terms.module').then(m => m.TermsModule)}, 
  {path: 'gerente', loadChildren : ()=> import('./pages/admin/admin.module').then( m => m.AdminModule)},
  {path: 'administrador', loadChildren : () => import('./pages/employee/employee.module').then( m => m.EmployeeModule)},
  {path: 'configuración', loadChildren : () => import('./pages/employee/other/other.module').then( m => m.OtherModule)},
  {path: '**', redirectTo: 'home', pathMatch : 'full'}, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
