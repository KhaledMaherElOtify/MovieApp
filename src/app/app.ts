import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet , Header , Footer],
    templateUrl: './app.html',
})
export class App {
  protected title = 'MovieApp';


}


