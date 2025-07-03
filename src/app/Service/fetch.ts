import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const Api_key = '943a1d14054f1dcc52c2bc72de292ab7';
const URL = 'https://api.themoviedb.org/3';

@Injectable({
  providedIn: 'root'
})
export class Fetch {

  constructor(private _HttpClient: HttpClient) { }

  getMovies(page: number = 1): Observable<any> {
  return this._HttpClient.get(`https://api.themoviedb.org/3/movie/popular?api_key=${Api_key}&page=${page}`);
}


  getMovieById(id: number): Observable<any> {
    return this._HttpClient.get(`${URL}/movie/${id}?api_key=${Api_key}&language=en-US`);
  }

  getSimilarMovies(id: number, page: number = 1): Observable<any> {
    return this._HttpClient.get(`${URL}/movie/${id}/similar?api_key=${Api_key}&language=en-US&page=${page}`);
  }

}
