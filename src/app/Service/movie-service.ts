// movie-service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, switchMap } from 'rxjs';
import { environment } from '../../environmets/environmet';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private languageSubject = new BehaviorSubject<string>('en-US');
  language$ = this.languageSubject.asObservable();

  constructor(private http: HttpClient) {}

  setLanguage(lang: string): void {
    this.languageSubject.next(lang);
  }

  getNowPlaying(page: number = 1) {
    const lang = this.languageSubject.value;
    return this.http.get<any>(`https://api.themoviedb.org/3/movie/now_playing?api_key=${environment.apiKey}&language=${lang}&page=${page}`);
  }

  getCurrentLanguage(): string {
  return this.languageSubject.value;
}
}

