import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { IMovie } from '../../Models/imovie';
import { Fetch } from '../../Service/fetch';
import { WishlistService } from '../../Service/wishlist.service';
import { MovieService } from '../../Service/movie-service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class Home implements OnInit {

  MovieList: IMovie[] = [];
  searchResults: IMovie[] = [];

  searchTerm: string = '';
  selectedGenreId: string = '';
  genres: { id: number; name: string }[] = [];

  
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 8;

  
  private excludedGenreIds = [18,10749]; // Horror, Documentary

  // API Key
  private API_KEY = '943a1d14054f1dcc52c2bc72de292ab7';

  constructor(
    private http: HttpClient,
    private _Fetch: Fetch,
    private wishlistService: WishlistService,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    this.loadGenres();
    this.movieService.language$.subscribe(() => {
      this.loadNowPlayingMovies(this.currentPage);
    });
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
    this.searchTerm.trim().length >= 2
      ? this.performSearch(this.searchTerm, page)
      : this.loadNowPlayingMovies(page);
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
    const encoded = encodeURIComponent(query);
    this.http.get<any>(
      `https://api.themoviedb.org/3/search/movie?query=${encoded}&api_key=${this.API_KEY}&page=${page}`
    ).subscribe({
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
    this.http.get<any>(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${this.API_KEY}`
    ).subscribe({
      next: res => {
        this.genres = res.genres.filter((g: any) => !this.excludedGenreIds.includes(g.id));
      },
      error: err => console.error('Failed to load genres', err)
    });
  }

  filterByGenre(): void {
    this.movieService.language$.subscribe(lang => {
      if (!this.selectedGenreId) {
        this.searchTerm.trim()
          ? this.performSearch(this.searchTerm, 1)
          : this.loadNowPlayingMovies(1);
        return;
      }

      this.http.get<any>(
        `https://api.themoviedb.org/3/discover/movie?with_genres=${this.selectedGenreId}&api_key=${this.API_KEY}&language=${lang}&page=1`
      ).subscribe({
        next: res => {
          this.searchResults = this.filterMovies(res.results);
          this.totalPages = res.total_pages;
          this.currentPage = 1;
        },
        error: err => console.error('Genre filter error:', err)
      });
    });
  }

  private filterMovies(movies: IMovie[]): IMovie[] {
    return movies.filter(movie =>
      movie?.adult === false &&
      !movie.genre_ids?.some(id => this.excludedGenreIds.includes(id))
    );
  }

  toggleWishlist(movie: IMovie): void {
    this.wishlistService.toggleWishlist(movie);
  }

  isInWishlist(id: number): boolean {
    return this.wishlistService.isInWishlist(id);
  }
}
