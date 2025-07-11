import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Fetch } from '../../Service/fetch';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { WishlistService } from '../../Service/wishlist.service';

@Component({
  selector: 'App-details',
  templateUrl: './details.html',
  styleUrls: ['./details.css'],
  imports:[CommonModule , RouterLink]
})
export class MovieDetailsComponent implements OnInit {
  movie: any;
  similarMovies: any[] = [];
  similarPage = 1;
  similarTotalPages = 1;
  isFavorite = false;
  genreList: { [id: number]: string } = {
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
    99: 'Documentary',  10751: 'Family', 14: 'Fantasy', 36: 'History',
    27: 'Horror', 9648: 'Mystery',  878: 'Science Fiction',
    10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
  };

  constructor(
    private route: ActivatedRoute,
    private fetch: Fetch,
    private location: Location,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = +params.get('id')!;
      if (id) {
        this.fetch.getMovieById(id).subscribe(movie => {
          this.movie = movie;
          this.isFavorite = this.wishlistService.isInWishlist(id);
        });
        this.loadSimilarMovies(id, 1);
      }
    });
  }

  loadSimilarMovies(id: number, page: number) {
    this.fetch.getSimilarMovies(id, page).subscribe(res => {
      this.similarMovies = res.results;
      this.similarPage = res.page;
      this.similarTotalPages = res.total_pages;
    });
  }

  nextSimilarPage() {
    if (this.similarPage < this.similarTotalPages) {
      this.loadSimilarMovies(this.movie.id, this.similarPage + 1);
    }
  }

  prevSimilarPage() {
    if (this.similarPage > 1) {
      this.loadSimilarMovies(this.movie.id, this.similarPage - 1);
    }
  }

  toggleFavorite() {
    this.wishlistService.toggleWishlist(this.movie);
    this.isFavorite = this.wishlistService.isInWishlist(this.movie.id);
  }

  getGenreName(id: number): string {
    return this.genreList[id] || 'Other';
  }
}
