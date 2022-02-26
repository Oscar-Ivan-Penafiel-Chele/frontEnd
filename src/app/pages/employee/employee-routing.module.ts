import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardEmployeeComponent } from './dashboard-employee/dashboard-employee.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes : Routes = [
  { path:'', component: DashboardEmployeeComponent, canActivate : [AuthGuard], data : { role : '2'},
    children : [
      {path: '', redirectTo: 'products', pathMatch : 'full'},
      {path: 'brand', loadChildren : ()=> import('./brand/brand.module').then( m => m.BrandModule)},
      {path: 'category', loadChildren : () => import('./category/category.module').then( m => m.CategoryModule)},
      {path: 'employee', loadChildren : () => import('./report/report.module').then(m => m.ReportModule)},
      {path: 'products', loadChildren : () => import('./products/products.module').then(m => m.ProductsModule)},
      {path: 'promotions', loadChildren : () => import('./promo/promo.module').then(m => m.PromoModule)},
      {path: 'provider', loadChildren : () => import('./provider/provider.module').then(m => m.ProviderModule)},
    ]
  },
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
export class EmployeeRoutingModule { }
