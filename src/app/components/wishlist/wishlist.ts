import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { IMovie } from '../../Models/imovie';
import { WishlistService } from '../../Service/wishlist.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule,RouterModule],
  templateUrl: './wishlist.html',
  styleUrls: ['./wishlist.css']
})
export class Wishlist implements OnInit, OnDestroy {
  wishlistItems: IMovie[] = [];
  wishlistCount: number = 0;
  private subscription: Subscription = new Subscription();

  constructor(
    private wishlistService: WishlistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.wishlistService.getWishlistItems().subscribe(items => {
        this.wishlistItems = items;
      })
    );
    this.subscription.add(
      this.wishlistService.getWishlistCount().subscribe(count => {
        this.wishlistCount = count;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeFromWishlist(movie: IMovie): void {
    this.wishlistService.removeFromWishlist(movie.id);
  }

  toggleWishlist(movie: IMovie): void {
    this.wishlistService.toggleWishlist(movie);
  }

  isInWishlist(movieId: number): boolean {
    return this.wishlistService.isInWishlist(movieId);
  }

  clearWishlist(): void {
    this.wishlistService.clearWishlist();
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
} 