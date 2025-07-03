import { Routes } from '@angular/router';
import { Register } from './pages/register/register';
import { Home } from './components/home/home';

export const routes: Routes = [
  { 
    path: '',
    redirectTo: 'home',
    pathMatch: 'full' 
  },
  {
    path: 'home',
    loadComponent: () =>
    import('./components/home/home').then(m => m.Home)
  },
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
    path: 'wishlist',
    loadComponent: () =>
      import('./components/wishlist/wishlist').then(m => m.Wishlist)
  },
  {
    path: 'details/:id',
    loadComponent: () =>
      import('./components/details/details').then(m => m.MovieDetailsComponent)
  },
    
   { path: '**', redirectTo: '' }
];
