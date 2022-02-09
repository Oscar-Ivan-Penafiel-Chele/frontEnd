import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AboutComponent } from './pages/about/about.component';
import { CategoryAdminComponent } from './pages/admin/category-admin/category-admin.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { IndicatorsAdminComponent } from './pages/admin/indicators-admin/indicators-admin.component';
import { OrdersAdminComponent } from './pages/admin/orders-admin/orders-admin.component';
import { ProductsAdminComponent } from './pages/admin/products-admin/products-admin.component';
import { PromoAdminComponent } from './pages/admin/promo-admin/promo-admin.component';
import { ReportAdminComponent } from './pages/admin/report-admin/report-admin.component';
import { UsersAdminComponent } from './pages/admin/users-admin/users-admin.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CategoryComponent } from './pages/employee/category/category.component';
import { DashboardEmployeeComponent } from './pages/employee/dashboard-employee/dashboard-employee.component';
import { OrdersComponent } from './pages/employee/orders/orders.component';
import { ProductsComponent } from './pages/employee/products/products.component';
import { PromoComponent } from './pages/employee/promo/promo.component';
import { ReportComponent } from './pages/employee/report/report.component';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { TermsComponent } from './pages/terms/terms.component';
import { ShopComponent } from './pages/user/shop/shop.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch : 'full'}, 
  {path: '', component : HomeComponent, pathMatch : 'full', }, 
  {path: 'login', component : LoginComponent, pathMatch : 'full', }, 
  {path: 'signup', component : SignupComponent, pathMatch : 'full', }, 
  {path: 'contact', component : ContactComponent, pathMatch : 'full', }, 
  {path: 'about', component : AboutComponent, pathMatch : 'full', }, 
  {path: 'shop', component : ShopComponent, pathMatch : 'full', }, 
  {path: 'terminos-y-condiciones', component : TermsComponent, pathMatch : 'full', }, 
  {path: 'dashboard', component : DashboardComponent,
    children : [
      {path: '', redirectTo: 'indicators', pathMatch : 'full'},
      {path: 'indicators', component : IndicatorsAdminComponent, pathMatch : 'full',},
      {path: 'promotions', component : PromoAdminComponent, pathMatch : 'full',},
      {path: 'users', component : UsersAdminComponent, pathMatch : 'full',},
      {path: 'products', component : ProductsAdminComponent, pathMatch : 'full',},
      {path: 'orders', component : OrdersAdminComponent, pathMatch : 'full',},
      {path: 'category', component : CategoryAdminComponent, pathMatch : 'full',},
      {path: 'report', component : ReportAdminComponent, pathMatch : 'full',},
    ]
  }, 
  {path: 'dashboard-employee', component : DashboardEmployeeComponent, canActivate : [AuthGuard],
    children : [
      {path: '', redirectTo: 'products', pathMatch : 'full'},
      {path: 'promotions', component : PromoComponent, pathMatch : 'full',},
      {path: 'products', component : ProductsComponent, pathMatch : 'full',},
      {path: 'orders', component : OrdersComponent, pathMatch : 'full',},
      {path: 'category', component : CategoryComponent, pathMatch : 'full',},
      {path: 'report', component : ReportComponent, pathMatch : 'full',},
    ]
  }, 
  {path: '**', redirectTo: '', pathMatch : 'full'}, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
