import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { SortByOrderPipe } from './pipes/sort-by-order.pipe';
import { AuthInterceptor } from './auth/interceptor/auth.interceptor';
import { BnNgIdleService } from 'bn-ng-idle';
import { OverlayInactivityModule } from './shared/components/overlay-inactivity/overlay-inactivity.module';

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
    OverlayInactivityModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    BnNgIdleService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
