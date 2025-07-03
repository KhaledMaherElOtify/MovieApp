import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
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
export class Home implements OnInit, OnDestroy {

  MovieList: IMovie[] = [];
  searchResults: IMovie[] = [];
  wishlistCount: number = 0;

  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 8;

  private API_KEY = '943a1d14054f1dcc52c2bc72de292ab7';
  private subscription: Subscription = new Subscription();

  constructor(
    private _Fetch: Fetch,
    private http: HttpClient,
    private wishlistService: WishlistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadNowPlayingMovies(this.currentPage);
    this.subscription.add(
      this.wishlistService.getWishlistCount().subscribe(count => {
        this.wishlistCount = count;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
}
