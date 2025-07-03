import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { IMovie } from '../../Models/imovie';
import { Fetch } from '../../Service/fetch';
import { WishlistService } from '../../Service/wishlist.service';
import { MovieService } from '../../Service/movie-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class Home implements OnInit, OnDestroy {
  MovieList: IMovie[] = [];
  searchResults: IMovie[] = [];
  language: string = 'en-US';
  searchTerm: string = '';
  selectedGenreId: string = '';
  genres: { id: number; name: string }[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 8;
  private subscription: Subscription = new Subscription();
  private excludedGenreIds = [18, 10749]; // Drama, Romance
  private API_KEY = '943a1d14054f1dcc52c2bc72de292ab7';

  constructor(
    private http: HttpClient,
    private _Fetch: Fetch,
    private wishlistService: WishlistService,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    this.loadGenres();
    this.subscription.add(
      this.movieService.language$.subscribe(lang => {
        this.language = lang;
        this.loadNowPlayingMovies(this.currentPage);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get textDirection(): string {
    return this.language === 'ar-SA' ? 'rtl' : 'ltr';
  }

  get activeData(): IMovie[] {
    return this.searchResults.length > 0 ? this.searchResults : this.MovieList;
  }

  get pages(): number[] {
    const maxPages = 7;
    const start = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
    const end = Math.min(this.totalPages, start + maxPages - 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;

    if (this.searchTerm.trim().length >= 2) {
      this.performSearch(this.searchTerm, page);
    } else {
      this.loadNowPlayingMovies(page);
    }
  }

  loadNowPlayingMovies(page: number): void {
    this._Fetch.getMovies(page).subscribe({
      next: res => {
        this.MovieList = this.filterMovies(res.results);
        this.totalPages = res.total_pages;
        this.searchResults = [];
      },
      error: err => console.error('Error loading movies:', err)
    });
  }

  onSearchChange(): void {
    if (this.searchTerm.trim().length < 2) {
      this.clearSearch();
      return;
    }
    this.performSearch(this.searchTerm, 1);
  }

  performSearch(query: string, page: number): void {
    const encodedQuery = encodeURIComponent(query);
    this.http
      .get<any>(`https://api.themoviedb.org/3/search/movie?query=${encodedQuery}&api_key=${this.API_KEY}&page=${page}&language=${this.language}`)
      .subscribe({
        next: res => {
          this.searchResults = this.filterMovies(res.results);
          this.totalPages = res.total_pages;
          this.currentPage = page;
        },
        error: err => console.error('Search error:', err)
      });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchResults = [];
    this.currentPage = 1;
    this.loadNowPlayingMovies(1);
  }

  loadGenres(): void {
    this.http
      .get<any>(`https://api.themoviedb.org/3/genre/movie/list?api_key=${this.API_KEY}&language=${this.language}`)
      .subscribe({
        next: res => {
          this.genres = res.genres.filter((genre: { id: number; name: string }) => !this.excludedGenreIds.includes(genre.id));
        },
        error: err => console.error('Failed to load genres', err)
      });
  }

  filterByGenre(): void {
    if (!this.selectedGenreId) {
      if (this.searchTerm.trim()) {
        this.performSearch(this.searchTerm, 1);
      } else {
        this.loadNowPlayingMovies(1);
      }
      return;
    }

    this.http
      .get<any>(`https://api.themoviedb.org/3/discover/movie?with_genres=${this.selectedGenreId}&api_key=${this.API_KEY}&language=${this.language}&page=1`)
      .subscribe({
        next: res => {
          this.searchResults = this.filterMovies(res.results);
          this.totalPages = res.total_pages;
          this.currentPage = 1;
        },
        error: err => console.error('Failed to filter by genre', err)
      });
  }

  toggleWishlist(movie: IMovie): void {
    this.wishlistService.toggleWishlist(movie);
  }

  isInWishlist(movieId: number): boolean {
    return this.wishlistService.isInWishlist(movieId);
  }

  private filterMovies(movies: IMovie[]): IMovie[] {
    return movies.filter(movie => 
      !movie.genre_ids.some(genreId => this.excludedGenreIds.includes(genreId))
    );
  }
}