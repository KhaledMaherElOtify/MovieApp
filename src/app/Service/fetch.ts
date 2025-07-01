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

  getMovies(): Observable<any> {
    return this._HttpClient.get(`${URL}/movie/popular?api_key=${Api_key}`);
  }
}
