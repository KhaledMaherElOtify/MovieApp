import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { WishlistService } from '../../Service/wishlist.service';
import { Auth, authState, User } from '@angular/fire/auth';
import { MovieService } from '../../Service/movie-service';

@Component({
  selector: 'app-header',
  imports: [CommonModule , RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {
    subscription: Subscription = new Subscription();
    wishlistCount: number = 0;
    isAuthenticated: boolean = false;
    user: User | null = null;
    availableLanguages = [
    { code: 'en-US', name: 'En' },
    { code: 'ar-SA', name: 'Ar' },
    { code: 'fr-FR', name: 'Fr' },
    { code: 'es-ES', name: 'Es' }
  ];

  selectedLanguage = this.availableLanguages[0];
  constructor(private router: Router,
      private wishlistService: WishlistService,
      private auth: Auth,
      private movieService: MovieService
    ) {}
  ngOnInit(): void {
    this.subscription.add(
      this.wishlistService.getWishlistCount().subscribe(count => {
        this.wishlistCount = count;
      })
    );
    this.subscription.add(
      authState(this.auth).subscribe(user => {
        this.isAuthenticated = !!user;
        this.user = user;
      })
    );
  }
  goToWishlist(): void {
    this.router.navigate(['/wishlist']);
  }
  logout(): void {
    this.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    }).catch(error => {
      console.error('Logout failed', error);
    });
  }
changeLanguage(lang: { code: string; name: string }, event: MouseEvent): void {
  event.preventDefault();
  this.selectedLanguage = lang;

  this.movieService.setLanguage(lang.code);
}

}
