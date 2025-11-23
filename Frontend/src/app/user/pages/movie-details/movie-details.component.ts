import { Component, OnInit, Inject } from '@angular/core';
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
  movie: Movie | null = null;

  constructor(
    @Inject(ActivatedRoute) private route: ActivatedRoute,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    const movieId = this.route.snapshot.paramMap.get('id');
    if (movieId) {
      this.movieService.getMovieById(movieId).subscribe(movie => {
        this.movie = movie;
      });
    }
  }

  onImageError(event: any): void {
    if (this.movie) {
      event.target.src = 'https://via.placeholder.com/300x450/667eea/ffffff?text=' + encodeURIComponent(this.movie.title);
    }
  }
}