import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

import { CategoryAdminComponent } from './pages/admin/category-admin/category-admin.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { IndicatorsAdminComponent } from './pages/admin/indicators-admin/indicators-admin.component';
import { OrdersAdminComponent } from './pages/admin/orders-admin/orders-admin.component';
import { ProductsAdminComponent } from './pages/admin/products-admin/products-admin.component';
import { PromoAdminComponent } from './pages/admin/promo-admin/promo-admin.component';
import { ReportAdminComponent } from './pages/admin/report-admin/report-admin.component';
import { UsersAdminComponent } from './pages/admin/users-admin/users-admin.component';
import { CarComponent } from './pages/car/car.component';
import { BrandComponent } from './pages/employee/brand/brand.component';
import { CategoryComponent } from './pages/employee/category/category.component';
import { DashboardEmployeeComponent } from './pages/employee/dashboard-employee/dashboard-employee.component';
import { OrdersComponent } from './pages/employee/orders/orders.component';
import { ProductsComponent } from './pages/employee/products/products.component';
import { PromoComponent } from './pages/employee/promo/promo.component';
import { ProviderComponent } from './pages/employee/provider/provider.component';
import { ReportComponent } from './pages/employee/report/report.component';

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
  {path: 'gerente', component : DashboardComponent, canActivate : [AuthGuard], data : { role : '1'},
    children : [
      {path: '', redirectTo: 'indicators', pathMatch : 'full'},
      {path: 'indicators', component : IndicatorsAdminComponent, pathMatch : 'full',},
      {path: 'promotions', component : PromoAdminComponent, pathMatch : 'full',},
      {path: 'users', component : UsersAdminComponent, pathMatch : 'full',},
      {path: 'products', component : ProductsAdminComponent, pathMatch : 'full',},
      {path: 'orders', component : OrdersAdminComponent, pathMatch : 'full',},
      {path: 'category', component : CategoryAdminComponent, pathMatch : 'full',},
      {path: 'employee', component : ReportAdminComponent, pathMatch : 'full',},
    ]
  }, 
  {path: 'administrador', loadChildren : () => import('./pages/employee/employee.module').then( m => m.EmployeeModule)}, 
   {path: '**', redirectTo: 'home', pathMatch : 'full'}, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
