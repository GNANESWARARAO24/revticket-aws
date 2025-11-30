import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Movie } from '../../../core/models/movie.model';

@Component({
  selector: 'app-movie-slider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="movie-slider">
      <div class="slider-header">
        <h2>{{ title }}</h2>
      </div>
      <div class="slider-wrapper">
        <button class="nav-btn left" (click)="scrollLeft()" *ngIf="canScrollLeft">‹</button>
        <div class="slider-container" #sliderContainer (scroll)="onScroll()">
          <div class="movie-card" *ngFor="let movie of movies">
            <div class="card-image" (click)="viewDetails(movie.id)">
              <img [src]="movie.posterUrl || 'assets/images/movies/default-poster.png'" [alt]="movie.title">
              <div class="rating-badge">⭐ {{ movie.rating || 'N/A' }}</div>
            </div>
            <div class="card-content">
              <h3 class="movie-title" (click)="viewDetails(movie.id)">{{ movie.title }}</h3>
              <div class="movie-meta">
                <span>🕐 {{ movie.duration }}m</span>
                <span>🌍 {{ movie.language }}</span>
              </div>
              <div class="genre-tags">
                <span class="tag" *ngFor="let genre of movie.genre?.slice(0, 2)">{{ genre }}</span>
              </div>
              <div class="card-actions">
                <button class="btn-outline" (click)="viewShowtimes(movie.id)">Showtimes</button>
                <button class="btn-book" (click)="bookNow(movie.id)">Book</button>
              </div>
            </div>
          </div>
        </div>
        <button class="nav-btn right" (click)="scrollRight()" *ngIf="canScrollRight">›</button>
      </div>
    </div>
  `,
  styles: [`
    .movie-slider { padding: 48px 0; background: #f8f9fa; }
    .slider-header { max-width: 1400px; margin: 0 auto 24px; padding: 0 32px; }
    .slider-header h2 { font-size: 28px; font-weight: 700; color: #2c3e50; margin: 0; }
    .slider-wrapper { position: relative; max-width: 1400px; margin: 0 auto; padding: 0 32px; }
    .slider-container {
      display: flex;
      gap: 20px;
      overflow-x: auto;
      scroll-behavior: smooth;
      scrollbar-width: none;
      padding-bottom: 16px;
    }
    .slider-container::-webkit-scrollbar { display: none; }
    .movie-card {
      flex: 0 0 240px;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      transition: all 0.3s ease;
    }
    .movie-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.15);
    }
    .card-image {
      position: relative;
      width: 100%;
      height: 340px;
      overflow: hidden;
      cursor: pointer;
    }
    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }
    .movie-card:hover .card-image img { transform: scale(1.05); }
    .rating-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      background: rgba(0,0,0,0.75);
      color: white;
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 13px;
      font-weight: 600;
      backdrop-filter: blur(10px);
    }
    .card-content { padding: 16px; }
    .movie-title {
      font-size: 16px;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 8px;
      cursor: pointer;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 42px;
    }
    .movie-title:hover { color: #667eea; }
    .movie-meta {
      display: flex;
      gap: 12px;
      font-size: 13px;
      color: #666;
      margin-bottom: 8px;
    }
    .genre-tags {
      display: flex;
      gap: 6px;
      margin-bottom: 12px;
      min-height: 28px;
    }
    .tag {
      background: #f5f5f5;
      color: #555;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
    }
    .card-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .btn-outline, .btn-book {
      padding: 10px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
    }
    .btn-outline {
      background: white;
      color: #667eea;
      border: 2px solid #667eea;
    }
    .btn-outline:hover {
      background: #f8f9ff;
      transform: translateY(-2px);
    }
    .btn-book {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .btn-book:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
    }
    .nav-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: white;
      border: none;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      font-size: 24px;
      cursor: pointer;
      z-index: 10;
      transition: all 0.3s ease;
      color: #2c3e50;
    }
    .nav-btn:hover {
      background: #667eea;
      color: white;
      transform: translateY(-50%) scale(1.1);
    }
    .nav-btn.left { left: 0; }
    .nav-btn.right { right: 0; }
    @media (max-width: 768px) {
      .slider-wrapper { padding: 0 16px; }
      .nav-btn { display: none; }
    }
  `]
})
export class MovieSliderComponent {
  @Input() movies: Movie[] = [];
  @Input() title: string = 'Now Showing';
  
  canScrollLeft = false;
  canScrollRight = true;
  
  constructor(private router: Router) {}
  
  scrollLeft(): void {
    const container = document.querySelector('.slider-container') as HTMLElement;
    if (container) {
      container.scrollBy({ left: -500, behavior: 'smooth' });
    }
  }
  
  scrollRight(): void {
    const container = document.querySelector('.slider-container') as HTMLElement;
    if (container) {
      container.scrollBy({ left: 500, behavior: 'smooth' });
    }
  }
  
  onScroll(): void {
    const container = document.querySelector('.slider-container') as HTMLElement;
    if (container) {
      this.canScrollLeft = container.scrollLeft > 0;
      this.canScrollRight = container.scrollLeft < container.scrollWidth - container.clientWidth - 10;
    }
  }
  
  viewDetails(movieId: string): void {
    this.router.navigate(['/user/movie-details', movieId]);
  }
  
  viewShowtimes(movieId: string): void {
    this.router.navigate(['/user/movie-details', movieId]);
  }
  
  bookNow(movieId: string): void {
    this.router.navigate(['/user/movie-details', movieId]);
  }
}
