import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Register,Login],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'MovieApp';
}
