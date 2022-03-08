import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardEmployeeComponent } from './dashboard-employee/dashboard-employee.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes : Routes = [
  { path:'', component: DashboardEmployeeComponent, canActivate : [AuthGuard], data : { role : '2'},
    children : [
      {path: '', redirectTo: 'products', pathMatch : 'full'},
      {path: 'auditory', loadChildren : ()=> import('./auditory/auditory.module').then( m => m.AuditoryModule)},
      {path: 'brand', loadChildren : ()=> import('./brand/brand.module').then( m => m.BrandModule)},
      {path: 'banner', loadChildren : ()=> import('./banner/banner.module').then( m => m.BannerModule)},
      {path: 'category', loadChildren : () => import('./category/category.module').then( m => m.CategoryModule)},
      {path: 'employee', loadChildren : () => import('./report/report.module').then(m => m.ReportModule)},
      {path: 'migration', loadChildren : () => import('./migration/migration.module').then(m => m.MigrationModule)},
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
