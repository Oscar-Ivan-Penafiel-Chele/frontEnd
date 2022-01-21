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

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { DashboardEmployeeComponent } from './pages/employee/dashboard-employee/dashboard-employee.component';

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
    DashboardEmployeeComponent
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
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
