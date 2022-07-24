import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './page/login.component';

import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { BackgroundAnimateModule } from 'src/app/shared/components/background-animate/background-animate.module';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';
import { AuthInterceptor } from 'src/app/auth/interceptor/auth.interceptor';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    RouterModule,
    FormsModule,
    BackgroundAnimateModule,
    PrimengComponentsModule
  ], providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
})
export class LoginModule { }
