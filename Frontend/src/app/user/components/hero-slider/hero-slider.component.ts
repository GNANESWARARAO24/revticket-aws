import { Component, Input, OnInit, OnDestroy, OnChanges } from '@angular/core';
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
        <div class="slider-wrapper">
          @for (movie of movies; track movie.id; let i = $index) {
            <div class="slide" [class.active]="i === currentIndex">
              <div class="slide-content">
                <div class="content-left">
                  <div class="movie-badge">{{ movie.language }}</div>
                  <h1 class="movie-title">{{ movie.title }}</h1>
                  <div class="movie-meta">
                    <span class="rating">⭐ {{ movie.rating || 'N/A' }}</span>
                    <span class="duration">{{ formatDuration(movie.duration) }}</span>
                    <span class="genre">{{ movie.genre[0] || 'Movie' }}</span>
                  </div>

                </div>
                <div class="content-right">
                  <img [src]="movie.posterUrl" [alt]="movie.title" class="movie-poster">
                </div>
              </div>
            </div>
          }
          <div class="slider-controls">
            <button class="control-btn prev" (click)="prevSlide()" aria-label="Previous">‹</button>
            <button class="control-btn next" (click)="nextSlide()" aria-label="Next">›</button>
          </div>
          <div class="pagination-dots">
            <span 
              *ngFor="let movie of movies; let i = index" 
              class="dot" 
              [class.active]="i === currentIndex"
              (click)="goToSlide(i)">
            </span>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .hero-slider {
      width: 100%;
      height: 480px;
      background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
      position: relative;
      overflow: hidden;
      border-bottom: 1px solid #e9ecef;
    }
    .slider-wrapper {
      width: 100%;
      height: 100%;
      position: relative;
    }
    .slide {
      width: 100%;
      height: 100%;
      opacity: 0;
      transition: opacity 0.5s ease-in-out;
      position: absolute;
      top: 0;
      left: 0;
    }
    .slide.active {
      opacity: 1;
      position: relative;
    }
    .slide-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 40px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 80px;
    }
    .content-left {
      flex: 1;
      max-width: 600px;
    }
    .movie-badge {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 8px 20px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 20px;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
    .movie-title {
      font-size: 52px;
      font-weight: 900;
      color: #1a1a2e;
      margin: 0 0 20px;
      line-height: 1.1;
    }
    .movie-meta {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 20px;
      color: #4a5568;
      font-size: 15px;
      font-weight: 600;
    }
    .movie-meta span {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 6px 12px;
      background: #f8f9fa;
      border-radius: 6px;
    }


    .content-right {
      flex-shrink: 0;
    }
    .movie-poster {
      width: 320px;
      height: 450px;
      object-fit: cover;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05);
      transition: transform 0.3s ease;
    }
    .movie-poster:hover {
      transform: scale(1.02);
    }
    .slider-controls {
      position: absolute;
      bottom: 30px;
      right: 30px;
      display: flex;
      gap: 12px;
      z-index: 10;
    }
    .control-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: white;
      border: none;
      color: #667eea;
      font-size: 24px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      font-weight: bold;
    }
    .control-btn:hover {
      background: #667eea;
      color: white;
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3);
    }
    .pagination-dots {
      position: absolute;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 8px;
      z-index: 10;
      background: rgba(255,255,255,0.9);
      padding: 8px 16px;
      border-radius: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(0,0,0,0.2);
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .dot:hover {
      background: rgba(0,0,0,0.4);
      transform: scale(1.2);
    }
    .dot.active {
      background: #667eea;
      width: 24px;
      border-radius: 4px;
    }
    @media (max-width: 1024px) {
      .movie-title { font-size: 40px; }
      .movie-poster { width: 280px; height: 400px; }
      .slide-content { gap: 40px; }
    }
    @media (max-width: 768px) {
      .hero-slider { height: 400px; }
      .slide-content { 
        flex-direction: column; 
        justify-content: center; 
        gap: 24px;
        padding: 0 20px;
      }
      .content-left { 
        max-width: 100%; 
        text-align: center; 
      }
      .content-right { display: none; }
      .movie-title { font-size: 32px; }
      .movie-meta { justify-content: center; }

      .slider-controls { bottom: 20px; right: 20px; }
      .pagination-dots { bottom: 20px; }
    }
  `]
})
export class HeroSliderComponent implements OnInit, OnChanges, OnDestroy {
  @Input() movies: Movie[] = [];
  
  currentIndex = 0;
  private intervalId: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('Hero slider initialized with', this.movies.length, 'movies');
    if (this.movies.length > 1) {
      this.startAutoSlide();
    }
  }

  ngOnChanges(): void {
    console.log('Movies changed:', this.movies.length);
    if (this.movies.length > 1 && !this.intervalId) {
      this.startAutoSlide();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }



  startAutoSlide(): void {
    this.stopAutoSlide();
    console.log('Starting auto-slide with 3 second interval');
    this.intervalId = setInterval(() => {
      console.log('Auto-sliding to next slide');
      this.nextSlide();
    }, 3000);
  }

  stopAutoSlide(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.movies.length;
  }

  prevSlide(): void {
    this.currentIndex = this.currentIndex === 0 ? this.movies.length - 1 : this.currentIndex - 1;
    this.resetAutoSlide();
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
    this.resetAutoSlide();
  }

  private resetAutoSlide(): void {
    if (this.movies.length > 1) {
      this.stopAutoSlide();
      this.startAutoSlide();
    }
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }

  bookMovie(movie: Movie): void {
    console.log('Booking movie:', movie.title, 'ID:', movie.id);
    if (movie?.id) {
      this.router.navigate(['/user/movie-details', movie.id]);
    }
  }
}
