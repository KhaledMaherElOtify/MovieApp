import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovieService } from './movie-service';

const Api_key = '943a1d14054f1dcc52c2bc72de292ab7';
const URL = 'https://api.themoviedb.org/3';

@Injectable({
  providedIn: 'root'
})
export class Fetch {

  constructor(private _HttpClient: HttpClient, private movieService: MovieService) { }

  getMovies(page: number = 1): Observable<any> {
     const language = this.movieService.getCurrentLanguage();
  return this._HttpClient.get(`https://api.themoviedb.org/3/movie/popular?api_key=${Api_key}&page=${page}&language=${language}`);
}


  getMovieById(id: number): Observable<any> {
     const language = this.movieService.getCurrentLanguage();
    return this._HttpClient.get(`${URL}/movie/${id}?api_key=${Api_key}&language=${language}`);
  }

  getSimilarMovies(id: number, page: number = 1): Observable<any> {
    const language = this.movieService.getCurrentLanguage();
    return this._HttpClient.get(`${URL}/movie/${id}/similar?api_key=${Api_key}&language=${language}&page=${page}`);
  }

}
