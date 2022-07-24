import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { SortByOrderPipe } from './pipes/sort-by-order.pipe';
import { AuthInterceptor } from './auth/interceptor/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
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
