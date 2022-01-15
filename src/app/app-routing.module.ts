import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
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
  {path: '**', redirectTo: '', pathMatch : 'full'}, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
