import { Routes } from '@angular/router';
import { isAuthenticatedGuard } from './guards/is-authenticated-guard';

export const routes: Routes = [
  { 
    path: '',
    redirectTo: 'home',
    pathMatch: 'full' 
  },
  {
    path: 'home',
    loadComponent: () =>
    import('./components/home/home').then(m => m.Home), 
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register').then(m => m.Register)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login').then(m => m.Login)
  },
  {
    path: 'wishlist',
    loadComponent: () =>
      import('./components/wishlist/wishlist').then(m => m.Wishlist)
  },
  {
    path: 'details/:id',
    loadComponent: () =>
      import('./components/details/details').then(m => m.MovieDetailsComponent),
    canActivate: [isAuthenticatedGuard]
  },
    
   { path: '**', redirectTo: '' }
];
