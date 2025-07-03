import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Fetch } from '../../Service/fetch';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

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
    99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
    27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction',
    10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
  };

  constructor(
    private route: ActivatedRoute,
    private fetch: Fetch,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = +params.get('id')!;
      if (id) {
        this.fetch.getMovieById(id).subscribe(movie => {
          this.movie = movie;
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
    this.isFavorite = !this.isFavorite;
  }

  goBack() {
    this.location.back();
  }

  getGenreName(id: number): string {
    return this.genreList[id] || 'Other';
  }
}
