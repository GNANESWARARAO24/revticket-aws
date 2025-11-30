import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Movie } from '../../../core/models/movie.model';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hero-banner" [style.background-image]="'linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%), url(' + (featuredMovie?.posterUrl || '') + ')'">
      <div class="hero-content">
        <h1 class="hero-title">{{ featuredMovie?.title || 'Experience Cinema Like Never Before' }}</h1>
        <div class="hero-meta" *ngIf="featuredMovie">
          <span class="rating">⭐ {{ featuredMovie.rating || 'N/A' }}</span>
          <span class="duration">🕐 {{ featuredMovie.duration }}m</span>
          <span class="language">🌍 {{ featuredMovie.language }}</span>
        </div>
        <div class="hero-genres" *ngIf="getGenres().length > 0">
          <span class="genre-tag" *ngFor="let genre of getGenres()">{{ genre }}</span>
        </div>
        <div class="hero-actions">
          <button class="btn-primary" (click)="bookTickets()" *ngIf="featuredMovie">
            🎫 Book Tickets
          </button>
          <button class="btn-secondary">
            ▶️ Watch Trailer
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hero-banner {
      height: 500px;
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      position: relative;
    }
    .hero-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 32px;
      color: white;
      max-width: 600px;
    }
    .hero-title {
      font-size: 48px;
      font-weight: 800;
      margin-bottom: 16px;
      line-height: 1.2;
    }
    .hero-meta {
      display: flex;
      gap: 20px;
      margin-bottom: 16px;
      font-size: 16px;
      font-weight: 600;
    }
    .hero-genres {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
    }
    .genre-tag {
      background: rgba(255, 255, 255, 0.2);
      padding: 6px 14px;
      border-radius: 16px;
      font-size: 13px;
      font-weight: 600;
      backdrop-filter: blur(10px);
    }
    .hero-actions {
      display: flex;
      gap: 16px;
    }
    .btn-primary, .btn-secondary {
      padding: 14px 32px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.3s ease;
    }
    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }
    .btn-secondary {
      background: transparent;
      color: white;
      border: 2px solid white;
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    @media (max-width: 768px) {
      .hero-banner { height: 400px; }
      .hero-title { font-size: 32px; }
      .hero-actions { flex-direction: column; }
      .btn-primary, .btn-secondary { width: 100%; }
    }
  `]
})
export class HeroBannerComponent {
  @Input() featuredMovie?: Movie;
  
  constructor(private router: Router) {}
  
  getGenres(): string[] {
    return this.featuredMovie?.genre?.slice(0, 3) || [];
  }
  
  bookTickets(): void {
    if (this.featuredMovie) {
      this.router.navigate(['/user/showtimes', this.featuredMovie.id]);
    }
  }
}
