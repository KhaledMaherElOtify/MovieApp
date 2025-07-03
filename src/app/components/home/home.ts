import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Fetch } from '../../Service/fetch';
import { WishlistService } from '../../Service/wishlist.service';
import { CommonModule } from '@angular/common';
import { IMovie } from '../../Models/imovie';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MovieService } from '../../Service/movie-service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {

  MovieList: IMovie[] = [];
  searchResults: IMovie[] = [];

  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 8;
  genres: { id: number; name: string }[] = [];
  selectedGenreId: string = '';

  private API_KEY = '943a1d14054f1dcc52c2bc72de292ab7';
  movies: IMovie[] = [];

  constructor(
    private _Fetch: Fetch,
    private http: HttpClient,
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
    const maxPagesToShow = 7;
    const startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
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

  loadMovies(): void {
  this.movieService.getNowPlaying().subscribe(movies => {
    this.movies = movies;
  });
}

  loadNowPlayingMovies(page: number): void {
    this._Fetch.getMovies(page).subscribe({
      next: (res) => {
        this.MovieList = res.results;
        this.totalPages = res.total_pages;
        this.searchResults = [];
      },
      error: (err) => {
        console.error('Error fetching movies:', err);
      }
    });
  }
  onSearchChange(): void {
    if (this.searchTerm.trim().length < 2) {
      this.searchResults = [];
      this.currentPage = 1;
      this.totalPages = 1;
      this.loadNowPlayingMovies(1);
      return;
    }

    this.performSearch(this.searchTerm, 1);
  }

  performSearch(query: string, page: number): void {
    const encodedQuery = encodeURIComponent(query);
    this.http
      .get<any>(`https://api.themoviedb.org/3/search/movie?query=${encodedQuery}&api_key=${this.API_KEY}&page=${page}`)
      .subscribe(res => {
        this.searchResults = res.results;
        this.totalPages = res.total_pages;
        this.currentPage = page;
      });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchResults = [];
    this.currentPage = 1;
    this.loadNowPlayingMovies(1);
  }

  toggleWishlist(movie: IMovie): void {
    this.wishlistService.toggleWishlist(movie);
  }

  isInWishlist(movieId: number): boolean {
    return this.wishlistService.isInWishlist(movieId);
  }

  loadGenres(): void {
  this.http
    .get<any>(`https://api.themoviedb.org/3/genre/movie/list?api_key=${this.API_KEY}`)
    .subscribe({
      next: (res) => this.genres = res.genres,
      error: (err) => console.error('Failed to load genres', err)
    });
}
filterByGenre(): void {
  this.movieService.language$.subscribe((lang) => {
    if (!this.selectedGenreId) {
      if (this.searchTerm.trim()) {
        this.performSearch(this.searchTerm, 1);
      } else {
        this.loadNowPlayingMovies(1);
      }
      return;
    }

    this.http
      .get<any>(`https://api.themoviedb.org/3/discover/movie?with_genres=${this.selectedGenreId}&api_key=${this.API_KEY}&language=${lang}&page=1`)
      .subscribe({
        next: (res) => {
          this.searchResults = res.results;
          this.totalPages = res.total_pages;
          this.currentPage = 1;
        },
        error: (err) => {
          console.error('Failed to filter by genre', err);
        }
      });
  });
}


}
