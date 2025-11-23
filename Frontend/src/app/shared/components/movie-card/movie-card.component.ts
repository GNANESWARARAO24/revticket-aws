import { Component, Input, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from '../../../core/models/movie.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css']
})
export class MovieCardComponent {
  @Input() movie!: Movie;

  constructor(@Inject(Router) private router: Router) {}

  viewDetails(): void {
    this.router.navigate(['/user/movie', this.movie.id]);
  }

  bookNow(): void {
    this.router.navigate(['/user/movie', this.movie.id, 'showtimes']);
  }

  viewShowtimes(): void {
    this.router.navigate(['/user/movie', this.movie.id, 'showtimes']);
  }
}