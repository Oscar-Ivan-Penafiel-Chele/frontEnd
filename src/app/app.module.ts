import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { TermsComponent } from './pages/terms/terms.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { ShopComponent } from './pages/user/shop/shop.component';
import { ScrollToUpComponent } from './components/scroll-to-up/scroll-to-up.component';

import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {TabViewModule} from 'primeng/tabview';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {DividerModule} from 'primeng/divider';
import {CheckboxModule} from 'primeng/checkbox';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {RippleModule} from 'primeng/ripple';
import {SkeletonModule} from 'primeng/skeleton';
import {TooltipModule} from 'primeng/tooltip';
import {CarouselModule} from 'primeng/carousel';
import {BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import {KeyFilterModule} from 'primeng/keyfilter';
import {ChipsModule} from 'primeng/chips';
import {DataViewModule} from 'primeng/dataview';
import {RatingModule} from 'primeng/rating';
import {DropdownModule} from 'primeng/dropdown';
import {PaginatorModule} from 'primeng/paginator';
import {DialogModule} from 'primeng/dialog';
import {PanelModule} from 'primeng/panel';
import {BadgeModule} from 'primeng/badge';
import {SidebarModule} from 'primeng/sidebar';
import {MenubarModule} from 'primeng/menubar';
import {MenuModule} from 'primeng/menu';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {TableModule} from 'primeng/table';
import {ToolbarModule} from 'primeng/toolbar';
import {FileUploadModule} from 'primeng/fileupload';
import {ToastModule} from 'primeng/toast';


import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { DashboardEmployeeComponent } from './pages/employee/dashboard-employee/dashboard-employee.component';
import { ProductsComponent } from './pages/employee/products/products.component';
import { OrdersComponent } from './pages/employee/orders/orders.component';
import { PromoComponent } from './pages/employee/promo/promo.component';
import { CategoryComponent } from './pages/employee/category/category.component';
import { ReportComponent } from './pages/employee/report/report.component';
import { UsersAdminComponent } from './pages/admin/users-admin/users-admin.component';
import { ProductsAdminComponent } from './pages/admin/products-admin/products-admin.component';
import { PromoAdminComponent } from './pages/admin/promo-admin/promo-admin.component';
import { CategoryAdminComponent } from './pages/admin/category-admin/category-admin.component';
import { IndicatorsAdminComponent } from './pages/admin/indicators-admin/indicators-admin.component';
import { ReportAdminComponent } from './pages/admin/report-admin/report-admin.component';
import { OrdersAdminComponent } from './pages/admin/orders-admin/orders-admin.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {RadioButtonModule} from 'primeng/radiobutton';


@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    ContactComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    TermsComponent,
    DashboardComponent,
    ShopComponent,
    ScrollToUpComponent,
    DashboardEmployeeComponent,
    ProductsComponent,
    OrdersComponent,
    PromoComponent,
    CategoryComponent,
    ReportComponent,
    UsersAdminComponent,
    ProductsAdminComponent,
    PromoAdminComponent,
    CategoryAdminComponent,
    IndicatorsAdminComponent,
    ReportAdminComponent,
    OrdersAdminComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PasswordModule,
    InputTextModule,
    TabViewModule,
    CardModule,
    ButtonModule,
    DividerModule,
    CheckboxModule,
    InputTextareaModule,
    RippleModule,
    SkeletonModule,
    TooltipModule,
    CarouselModule,
    KeyFilterModule,
    ChipsModule,
    DataViewModule,
    RatingModule,
    DropdownModule,
    PaginatorModule,
    PanelModule,
    DialogModule,
    BadgeModule,
    SidebarModule,
    MenubarModule,
    MenuModule,
    MessagesModule,
    MessageModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ToolbarModule,
    FileUploadModule,
    ToastModule,
    ConfirmDialogModule,
    RadioButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
