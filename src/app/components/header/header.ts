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
    isDarkMode: boolean = false;
    

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
    this.initTheme();
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

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  private initTheme(): void {
    const saved = localStorage.getItem('theme');
    if (saved) {
      this.isDarkMode = saved === 'dark';
    } else {
      // Use system preference if no saved theme
      this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.applyTheme();
  }

  private applyTheme(): void {
    const html = document.documentElement;
    if (this.isDarkMode) {
      html.classList.add('dark-mode');
    } else {
      html.classList.remove('dark-mode');
    }
  }
changeLanguage(lang: { code: string; name: string }, event: MouseEvent): void {
  event.preventDefault();
  this.selectedLanguage = lang;

  this.movieService.setLanguage(lang.code);
}

}
