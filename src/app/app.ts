import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { Home } from './components/home/home';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Home, Register, Login],
  template: `<router-outlet></router-outlet>`
})
export class App {
  protected title = 'MovieApp';
}
