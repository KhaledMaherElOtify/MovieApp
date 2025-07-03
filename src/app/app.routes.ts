import { Routes } from '@angular/router';
import { Home } from './components/home/home';

export const routes: Routes = [
  { path: '', component: Home },

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

