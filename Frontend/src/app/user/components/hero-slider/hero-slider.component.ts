import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Movie } from '../../../core/models/movie.model';

@Component({
  selector: 'app-hero-slider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hero-slider">
      @if (movies.length > 0) {
        <div class="slider-container" [style.background-image]="getBackgroundImage()">
          <div class="slider-overlay"></div>
          <div class="slider-content">
            <div class="content-left">
              <div class="movie-badge">{{ currentMovie.language }}</div>
              <h1 class="movie-title">{{ currentMovie.title }}</h1>
              <div class="movie-meta">
                <span class="rating">⭐ {{ currentMovie.rating || 'N/A' }}</span>
                <span class="duration">{{ currentMovie.duration }}m</span>
                <span class="certification">U/A</span>
              </div>
              <div class="movie-genres">
                <span *ngFor="let genre of currentMovie.genre?.slice(0, 3)">{{ genre }}</span>
              </div>
              <button class="book-btn" (click)="bookNow()">
                <span class="btn-icon">🎫</span>
                Book Now
              </button>
            </div>
            <div class="content-right">
              <img [src]="currentMovie.posterUrl" [alt]="currentMovie.title" class="movie-poster">
            </div>
          </div>
          <div class="slider-controls">
            <button class="control-btn prev" (click)="prevSlide()">‹</button>
            <div class="pagination-dots">
              <span 
                *ngFor="let movie of movies; let i = index" 
                class="dot" 
                [class.active]="i === currentIndex"
                (click)="goToSlide(i)">
              </span>
            </div>
            <button class="control-btn next" (click)="nextSlide()">›</button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .hero-slider {
      width: 100%;
      height: 500px;
      position: relative;
      overflow: hidden;
    }
    .slider-container {
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      position: relative;
      transition: background-image 0.6s ease-in-out;
    }
    .slider-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.4) 100%);
    }
    .slider-content {
      position: relative;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 32px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 60px;
    }
    .content-left {
      flex: 1;
      max-width: 600px;
      z-index: 2;
    }
    .movie-badge {
      display: inline-block;
      background: rgba(255,255,255,0.2);
      color: white;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 16px;
      backdrop-filter: blur(10px);
    }
    .movie-title {
      font-size: 56px;
      font-weight: 900;
      color: white;
      margin: 0 0 20px;
      line-height: 1.1;
      text-shadow: 0 4px 12px rgba(0,0,0,0.5);
    }
    .movie-meta {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 16px;
      color: white;
      font-size: 16px;
      font-weight: 600;
    }
    .rating {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .movie-genres {
      display: flex;
      gap: 10px;
      margin-bottom: 32px;
    }
    .movie-genres span {
      background: rgba(255,255,255,0.15);
      color: white;
      padding: 8px 18px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      backdrop-filter: blur(10px);
    }
    .book-btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 16px 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 18px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
    }
    .book-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
    }
    .btn-icon {
      font-size: 20px;
    }
    .content-right {
      flex-shrink: 0;
      z-index: 2;
    }
    .movie-poster {
      width: 300px;
      height: 420px;
      object-fit: cover;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.6);
      transition: transform 0.6s ease;
    }
    .slider-controls {
      position: absolute;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 24px;
      z-index: 10;
    }
    .control-btn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      border: 2px solid rgba(255,255,255,0.3);
      color: white;
      font-size: 28px;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .control-btn:hover {
      background: rgba(255,255,255,0.3);
      transform: scale(1.1);
    }
    .pagination-dots {
      display: flex;
      gap: 10px;
    }
    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: rgba(255,255,255,0.4);
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .dot.active {
      background: white;
      width: 32px;
      border-radius: 6px;
    }
    @media (max-width: 1024px) {
      .movie-title { font-size: 42px; }
      .movie-poster { width: 240px; height: 340px; }
    }
    @media (max-width: 768px) {
      .hero-slider { height: 400px; }
      .slider-content { flex-direction: column; justify-content: center; gap: 24px; }
      .content-left { max-width: 100%; text-align: center; }
      .content-right { display: none; }
      .movie-title { font-size: 32px; }
      .movie-meta, .movie-genres { justify-content: center; }
      .slider-controls { bottom: 20px; }
    }
  `]
})
export class HeroSliderComponent implements OnInit, OnDestroy {
  @Input() movies: Movie[] = [];
  
  currentIndex = 0;
  private intervalId: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  get currentMovie(): Movie {
    return this.movies[this.currentIndex] || {} as Movie;
  }

  getBackgroundImage(): string {
    const url = this.currentMovie.posterUrl || '';
    return `url(${url})`;
  }

  startAutoSlide(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 4000);
  }

  stopAutoSlide(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.movies.length;
  }

  prevSlide(): void {
    this.currentIndex = this.currentIndex === 0 ? this.movies.length - 1 : this.currentIndex - 1;
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  bookNow(): void {
    this.router.navigate(['/user/movie-details', this.currentMovie.id]);
  }
}
