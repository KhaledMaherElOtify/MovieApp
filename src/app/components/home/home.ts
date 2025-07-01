import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Fetch } from '../../Service/fetch';
import { CommonModule } from '@angular/common';
import { IMovie } from '../../Models/imovie';




@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit{

  MovieList:IMovie[]=[];
  constructor(private _Fetch: Fetch) {}
  ngOnInit(): void {
      this._Fetch.getMovies().subscribe({
        next:(res)=>{
          this.MovieList = res.results;
          // console.log(this.MovieList);          
        },
        error:(err)=>{
          console.error('Error fetching movies:', err);
        }
      }
      ); 
  }
}
