import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IMovie } from '../Models/imovie';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItems: IMovie[] = [];
  private wishlistSubject = new BehaviorSubject<IMovie[]>([]);
  private wishlistCountSubject = new BehaviorSubject<number>(0);

  constructor() {
    // Load wishlist from localStorage on service initialization
    this.loadWishlistFromStorage();
  }

  // Get wishlist items as observable
  getWishlistItems(): Observable<IMovie[]> {
    return this.wishlistSubject.asObservable();
  }

  // Get wishlist count as observable
  getWishlistCount(): Observable<number> {
    return this.wishlistCountSubject.asObservable();
  }

  // Add movie to wishlist
  addToWishlist(movie: IMovie): void {
    if (!this.isInWishlist(movie.id)) {
      this.wishlistItems.push(movie);
      this.updateWishlist();
    }
  }

  // Remove movie from wishlist
  removeFromWishlist(movieId: number): void {
    this.wishlistItems = this.wishlistItems.filter(movie => movie.id !== movieId);
    this.updateWishlist();
  }
  // Toggle movie in wishlist
  toggleWishlist(movie: IMovie): void {
    if (this.isInWishlist(movie.id)) {
      this.removeFromWishlist(movie.id);
    } else {
      this.addToWishlist(movie);
    }
  }

  // Check if movie is in wishlist
  isInWishlist(movieId: number): boolean {
    return this.wishlistItems.some(movie => movie.id === movieId);
  }

  // Get current wishlist items (synchronous)
  getCurrentWishlist(): IMovie[] {
    return [...this.wishlistItems];
  }

  // Get current wishlist count (synchronous)
  getCurrentWishlistCount(): number {
    return this.wishlistItems.length;
  }

  // Clear wishlist
  clearWishlist(): void {
    this.wishlistItems = [];
    this.updateWishlist();
  }

  // Update wishlist and save to localStorage
  private updateWishlist(): void {
    this.wishlistSubject.next([...this.wishlistItems]);
    this.wishlistCountSubject.next(this.wishlistItems.length);
    this.saveWishlistToStorage();
  }

  // Save wishlist to localStorage
  private saveWishlistToStorage(): void {
    localStorage.setItem('movieWishlist', JSON.stringify(this.wishlistItems));
  }

  // Load wishlist from localStorage
  private loadWishlistFromStorage(): void {
    const stored = localStorage.getItem('movieWishlist');
    if (stored) {
      try {
        this.wishlistItems = JSON.parse(stored);
        this.updateWishlist();
      } catch (error) {
        console.error('Error loading wishlist from storage:', error);
        this.wishlistItems = [];
      }
    }
  }
} 