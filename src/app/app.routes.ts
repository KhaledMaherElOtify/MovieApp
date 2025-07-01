import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register').then(m => m.Register)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.Login)
  },
  {
    path: '',
    redirectTo: 'register',
    pathMatch: 'full'
  }
];