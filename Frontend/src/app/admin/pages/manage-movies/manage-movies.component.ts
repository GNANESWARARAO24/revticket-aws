import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../../core/services/movie.service';
import { BookingService } from '../../../core/services/booking.service';
import { ShowtimeService } from '../../../core/services/showtime.service';
import { AlertService } from '../../../core/services/alert.service';
import { Movie } from '../../../core/models/movie.model';

@Component({
  selector: 'app-manage-movies',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './manage-movies.component.html',
  styleUrls: ['./manage-movies.component.css']
})
export class ManageMoviesComponent implements OnInit {
  movies = signal<Movie[]>([]);
  searchTerm = signal('');
  selectedGenre = signal('');
  selectedRating = signal('');
  loading = signal(false);
  deletingId = signal<string | null>(null);
  
  filteredMovies = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const genre = this.selectedGenre();
    const rating = this.selectedRating();
    
    return this.movies().filter(movie => {
      const matchesSearch = !search || 
        movie.title.toLowerCase().includes(search) ||
        (movie.description && movie.description.toLowerCase().includes(search));
      
      const matchesGenre = !genre || 
        (movie.genre && movie.genre.includes(genre));
      
      const matchesRating = !rating || 
        (movie.rating && movie.rating.toString() === rating);
      
      return matchesSearch && matchesGenre && matchesRating;
    });
  });

  availableGenres = computed(() => {
    const genres = new Set<string>();
    this.movies().forEach(movie => {
      movie.genre?.forEach(g => genres.add(g));
    });
    return Array.from(genres).sort();
  });

  constructor(
    private router: Router,
    private movieService: MovieService,
    private bookingService: BookingService,
    private showtimeService: ShowtimeService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading.set(true);
    this.movieService.getMovies().subscribe({
      next: (movies) => {
        this.movies.set(movies);
        this.loading.set(false);
      },
      error: () => {
        this.alertService.error('Failed to load movies');
        this.loading.set(false);
      }
    });
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/movies/default-poster.png';
  }

  getShowCount(movieId: string): number {
    // This would require fetching showtimes - simplified for now
    return 0; // Will be enhanced with showtime service
  }

  getBookingCount(movieId: string): number {
    // This would require fetching bookings - simplified for now
    return 0; // Will be enhanced with booking service
  }

  editMovie(movie: Movie): void {
    this.router.navigate(['/admin/add-movie'], { 
      queryParams: { edit: movie.id } 
    });
  }

  deleteMovie(movie: Movie): void {
    if (confirm(`Are you sure you want to delete "${movie.title}"? This action cannot be undone.`)) {
      this.deletingId.set(movie.id);
      this.movieService.deleteMovie(movie.id).subscribe({
        next: () => {
          this.alertService.success('Movie deleted successfully!');
          this.loadMovies();
          this.deletingId.set(null);
        },
        error: () => {
          this.alertService.error('Failed to delete movie');
          this.deletingId.set(null);
        }
      });
    }
  }

  toggleMovieStatus(movie: Movie): void {
    const updatedMovie = { ...movie, isActive: !movie.isActive };
    this.movieService.updateMovie(movie.id, updatedMovie).subscribe({
      next: () => {
        this.alertService.success(`Movie ${updatedMovie.isActive ? 'activated' : 'deactivated'} successfully!`);
        this.loadMovies();
      },
      error: () => {
        this.alertService.error('Failed to update movie status');
      }
    });
  }
}
