import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
<<<<<<< HEAD
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Register,Login],
  templateUrl: './app.html',
  styleUrl: './app.css'
=======
import { Home } from './components/home/home';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Home],
   template: `
    <router-outlet></router-outlet>
  `,
>>>>>>> 8cc1136a925c2f59c480a469f49bd3238cfa7c0a
})

export class App {
  protected title = 'MovieApp';
}
