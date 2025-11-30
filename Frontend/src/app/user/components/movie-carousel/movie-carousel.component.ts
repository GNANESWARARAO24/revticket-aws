import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Movie } from '../../../core/models/movie.model';

@Component({
  selector: 'app-movie-carousel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="movie-carousel">
      <div class="carousel-header">
        <h2 class="section-title">{{ title }}</h2>
        <div class="carousel-nav">
          <button class="nav-arrow left" (click)="scrollLeft()" [disabled]="!canScrollLeft">‹</button>
          <button class="nav-arrow right" (click)="scrollRight()" [disabled]="!canScrollRight">›</button>
        </div>
      </div>
      <div class="carousel-container" #carouselContainer (scroll)="updateScrollState()">
        <div class="movie-card" *ngFor="let movie of movies" (click)="viewDetails(movie.id)">
          <div class="card-poster">
            <img [src]="movie.posterUrl" [alt]="movie.title">
            <div class="rating-badge">⭐ {{ movie.rating || 'N/A' }}</div>
          </div>
          <div class="card-info">
            <h3 class="card-title">{{ movie.title }}</h3>
            <div class="card-meta">
              <span class="genre">{{ movie.genre?.[0] || 'Movie' }}</span>
            </div>
            <div class="card-actions">
              <button class="btn-showtimes" (click)="viewShowtimes($event, movie.id)">Showtimes</button>
              <button class="btn-book" (click)="bookNow($event, movie.id)">Book</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .movie-carousel {
      padding: 48px 0;
      background: white;
    }
    .carousel-header {
      max-width: 1400px;
      margin: 0 auto 24px;
      padding: 0 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .section-title {
      font-size: 28px;
      font-weight: 800;
      color: #1a1a1a;
      margin: 0;
    }
    .carousel-nav {
      display: flex;
      gap: 12px;
    }
    .nav-arrow {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: white;
      border: 2px solid #e9ecef;
      color: #1a1a1a;
      font-size: 24px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .nav-arrow:hover:not(:disabled) {
      background: #667eea;
      color: white;
      border-color: #667eea;
      transform: scale(1.1);
    }
    .nav-arrow:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
    .carousel-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 32px;
      display: flex;
      gap: 20px;
      overflow-x: auto;
      scroll-behavior: smooth;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    .carousel-container::-webkit-scrollbar {
      display: none;
    }
    .movie-card {
      flex: 0 0 260px;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      transition: all 0.3s ease;
      cursor: pointer;
    }
    .movie-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 32px rgba(0,0,0,0.15);
    }
    .card-poster {
      position: relative;
      width: 100%;
      height: 360px;
      overflow: hidden;
    }
    .card-poster img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }
    .movie-card:hover .card-poster img {
      transform: scale(1.08);
    }
    .rating-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 13px;
      font-weight: 700;
      backdrop-filter: blur(10px);
    }
    .card-info {
      padding: 16px;
    }
    .card-title {
      font-size: 17px;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 8px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 44px;
    }
    .card-meta {
      margin-bottom: 12px;
    }
    .genre {
      display: inline-block;
      background: #f5f5f5;
      color: #666;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }
    .card-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .btn-showtimes,
    .btn-book {
      padding: 10px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
    }
    .btn-showtimes {
      background: white;
      color: #667eea;
      border: 2px solid #667eea;
    }
    .btn-showtimes:hover {
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
    @media (max-width: 768px) {
      .carousel-header {
        padding: 0 16px;
      }
      .carousel-container {
        padding: 0 16px;
      }
      .movie-card {
        flex: 0 0 220px;
      }
      .card-poster {
        height: 300px;
      }
      .nav-arrow {
        display: none;
      }
    }
  `]
})
export class MovieCarouselComponent implements AfterViewInit {
  @Input() movies: Movie[] = [];
  @Input() title: string = 'Now Showing';
  
  @ViewChild('carouselContainer') carouselContainer!: ElementRef;
  
  canScrollLeft = false;
  canScrollRight = true;

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    setTimeout(() => this.updateScrollState(), 100);
  }

  scrollLeft(): void {
    const container = this.carouselContainer.nativeElement;
    container.scrollBy({ left: -280, behavior: 'smooth' });
    setTimeout(() => this.updateScrollState(), 300);
  }

  scrollRight(): void {
    const container = this.carouselContainer.nativeElement;
    container.scrollBy({ left: 280, behavior: 'smooth' });
    setTimeout(() => this.updateScrollState(), 300);
  }

  updateScrollState(): void {
    const container = this.carouselContainer.nativeElement;
    this.canScrollLeft = container.scrollLeft > 0;
    this.canScrollRight = container.scrollLeft < container.scrollWidth - container.clientWidth - 10;
  }

  viewDetails(movieId: string): void {
    this.router.navigate(['/user/movie-details', movieId]);
  }

  viewShowtimes(event: Event, movieId: string): void {
    event.stopPropagation();
    this.router.navigate(['/user/movie-details', movieId]);
  }

  bookNow(event: Event, movieId: string): void {
    event.stopPropagation();
    this.router.navigate(['/user/movie-details', movieId]);
  }
}
