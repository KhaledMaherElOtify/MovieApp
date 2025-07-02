import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Fetch } from '../../Service/fetch';
import { IMovie } from '../../Models/imovie';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {

  MovieList: IMovie[] = [];
  suggestedMovies: IMovie[] = [];
  searchResults: IMovie[] = [];
  searchTerm: string = '';

  constructor(private _Fetch: Fetch, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadNowPlayingMovies();
  }

  loadNowPlayingMovies() {
    this._Fetch.getMovies().subscribe({
      next: (res) => {
        this.MovieList = res.results;
        this.searchResults = []; // reset search results on load
      },
      error: (err) => {
        console.error('Error fetching movies:', err);
      }
    });
  }

  onSearchChange() {
    if (this.searchTerm.trim().length < 2) {
      this.suggestedMovies = [];
      return;
    }

    const API_KEY = '943a1d14054f1dcc52c2bc72de292ab7';
    const query = encodeURIComponent(this.searchTerm);
    this.http
      .get<any>(`https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${API_KEY}`)
      .subscribe(res => {
        this.suggestedMovies = res.results.slice(0, 5); // For dropdown
        this.searchResults = res.results;               // For full display
      });
  }

  clearSearch() {
    this.searchTerm = '';
    this.suggestedMovies = [];
    this.searchResults = [];
    this.loadNowPlayingMovies();
  }
}
