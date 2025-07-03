import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Fetch } from '../../Service/fetch';
import { WishlistService } from '../../Service/wishlist.service';
import { CommonModule } from '@angular/common';
import { IMovie } from '../../Models/imovie';
import { Subscription } from 'rxjs';
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

  currentPage: number = 1;
  itemsPerPage: number = 8;

  constructor(private _Fetch: Fetch, private http: HttpClient, private wishlistService: WishlistService,
    private router: Router) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this._Fetch.getMovies().subscribe({
      next: (res) => {
        this.MovieList = res.results;
      },
      error: (err) => {
        console.error('Error fetching movies:', err);
      }
    });
  }

  toggleWishlist(movie: IMovie): void {
    this.wishlistService.toggleWishlist(movie);
  }

  isInWishlist(movieId: number): boolean {
    return this.wishlistService.isInWishlist(movieId);
  }

  loadNowPlayingMovies() {
    this._Fetch.getMovies().subscribe({
      next: (res) => {
        this.MovieList = res.results;
        this.searchResults = [];
        this.currentPage = 1;
      },
      error: (err) => {
        console.error('Error fetching movies:', err);
      }
    });
  }

  onSearchChange() {
    if (this.searchTerm.trim().length < 2) {
      this.suggestedMovies = [];
      this.searchResults = [];
      this.currentPage = 1;
      return;
    }

    const API_KEY = '943a1d14054f1dcc52c2bc72de292ab7';
    const query = encodeURIComponent(this.searchTerm);

    this.http
      .get<any>(`https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${API_KEY}`)
      .subscribe(res => {
        this.suggestedMovies = res.results.slice(0, 5);
        this.searchResults = res.results;
        this.currentPage = 1;
      });
  }

  clearSearch() {
    this.searchTerm = '';
    this.suggestedMovies = [];
    this.searchResults = [];
    this.currentPage = 1;
    this.loadNowPlayingMovies();
  }

  get paginatedMovies(): IMovie[] {
    const data = this.activeData;
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return data.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.activeData.length / this.itemsPerPage);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  get activeData(): IMovie[] {
    return this.searchResults.length > 0 ? this.searchResults : this.MovieList;
  }
}
