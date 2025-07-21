import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';

export const routes: Routes = [
  // When the user visits the base URL, show the HomeComponent
  { path: '', component: HomeComponent },
  // Route for the login page
  { path: 'login', component: LoginComponent },
  // Route for the registration page
  { path: 'register', component: RegisterComponent },
  // Optional: A wildcard route to redirect unknown paths to home
  { path: '**', redirectTo: '', pathMatch: 'full' }
];