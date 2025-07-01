import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Home } from './components/home/home';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Home],
   template: `
    <router-outlet></router-outlet>
  `,
})

export class App {
  protected title = 'MovieApp';
}
