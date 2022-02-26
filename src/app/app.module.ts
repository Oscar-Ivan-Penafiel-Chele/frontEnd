import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { ScrollToUpComponent } from './components/scroll-to-up/scroll-to-up.component';

import {BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UsersAdminComponent } from './pages/admin/users-admin/users-admin.component';
import { ProductsAdminComponent } from './pages/admin/products-admin/products-admin.component';
import { PromoAdminComponent } from './pages/admin/promo-admin/promo-admin.component';
import { CategoryAdminComponent } from './pages/admin/category-admin/category-admin.component';
import { IndicatorsAdminComponent } from './pages/admin/indicators-admin/indicators-admin.component';
import { ReportAdminComponent } from './pages/admin/report-admin/report-admin.component';
import { OrdersAdminComponent } from './pages/admin/orders-admin/orders-admin.component';

import { SortByOrderPipe } from './pipes/sort-by-order.pipe';
import { AuthInterceptor } from './services/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ScrollToUpComponent,
    UsersAdminComponent,
    ProductsAdminComponent,
    PromoAdminComponent,
    CategoryAdminComponent,
    IndicatorsAdminComponent,
    ReportAdminComponent,
    OrdersAdminComponent,
    SortByOrderPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
