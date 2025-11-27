import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MovieService } from '../../../core/services/movie.service';
import { Movie } from '../../../core/models/movie.model';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private movieService = inject(MovieService);
  
  movie = signal<Movie | null>(null);

  ngOnInit(): void {
    const movieId = this.route.snapshot.paramMap.get('id');
    if (movieId) {
      this.movieService.getMovieById(movieId).subscribe(movie => {
        this.movie.set(movie);
      });
    }
  }

  onImageError(event: any): void {
    const currentMovie = this.movie();
    if (currentMovie) {
      event.target.src = 'https://via.placeholder.com/300x450/667eea/ffffff?text=' + encodeURIComponent(currentMovie.title);
    }
  }
}