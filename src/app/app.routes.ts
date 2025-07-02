import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Wishlist } from './components/wishlist/wishlist';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'wishlist', component: Wishlist },
  { path: '**', redirectTo: '' }
];
