import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Theater {
  id: string;
  name: string;
  location: string;
  city?: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-theatre-slider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="theatre-slider">
      <div class="slider-header">
        <h2>Best Theatres Near You</h2>
      </div>
      <div class="slider-wrapper">
        <button class="nav-btn left" (click)="scrollLeft()" *ngIf="canScrollLeft">‹</button>
        <div class="slider-container" #sliderContainer (scroll)="onScroll()">
          <div class="theatre-card" *ngFor="let theatre of theatres">
            <div class="theatre-icon">🎭</div>
            <h3 class="theatre-name">{{ theatre.name }}</h3>
            <p class="theatre-location">📍 {{ theatre.location }}</p>
            <button class="btn-view" (click)="viewTheatre(theatre.id)">View Shows</button>
          </div>
        </div>
        <button class="nav-btn right" (click)="scrollRight()" *ngIf="canScrollRight">›</button>
      </div>
    </div>
  `,
  styles: [`
    .theatre-slider { padding: 48px 0; background: white; }
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
    .theatre-card {
      flex: 0 0 280px;
      background: #f8f9fa;
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }
    .theatre-card:hover {
      transform: translateY(-4px);
      border-color: #667eea;
      box-shadow: 0 8px 16px rgba(102, 126, 234, 0.2);
    }
    .theatre-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }
    .theatre-name {
      font-size: 18px;
      font-weight: 700;
      color: #2c3e50;
      margin: 0 0 8px;
    }
    .theatre-location {
      font-size: 14px;
      color: #6c757d;
      margin: 0 0 16px;
    }
    .btn-view {
      width: 100%;
      padding: 10px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .btn-view:hover {
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
export class TheatreSliderComponent {
  @Input() theatres: Theater[] = [];
  
  canScrollLeft = false;
  canScrollRight = true;
  
  constructor(private router: Router) {}
  
  scrollLeft(): void {
    const container = document.querySelector('.theatre-slider .slider-container') as HTMLElement;
    if (container) {
      container.scrollBy({ left: -500, behavior: 'smooth' });
    }
  }
  
  scrollRight(): void {
    const container = document.querySelector('.theatre-slider .slider-container') as HTMLElement;
    if (container) {
      container.scrollBy({ left: 500, behavior: 'smooth' });
    }
  }
  
  onScroll(): void {
    const container = document.querySelector('.theatre-slider .slider-container') as HTMLElement;
    if (container) {
      this.canScrollLeft = container.scrollLeft > 0;
      this.canScrollRight = container.scrollLeft < container.scrollWidth - container.clientWidth - 10;
    }
  }
  
  viewTheatre(theatreId: string): void {
    this.router.navigate(['/user/showtimes'], { queryParams: { theaterId: theatreId } });
  }
}
