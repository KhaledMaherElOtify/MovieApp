import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import {   MovieDetailsComponent } from './components/details/details';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'details/:id', component: MovieDetailsComponent }
];