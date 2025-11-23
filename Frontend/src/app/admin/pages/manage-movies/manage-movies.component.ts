import { Component, OnInit } from '@angular/core';
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
  movies: Movie[] = [];
  filteredMovies: Movie[] = [];
  searchTerm = '';
  selectedGenre = '';
  selectedRating = '';
  loading = false;
  deletingId: string | null = null;

  // Get unique genres from movies
  get availableGenres(): string[] {
    const genres = new Set<string>();
    this.movies.forEach(movie => {
      movie.genre?.forEach(g => genres.add(g));
    });
    return Array.from(genres).sort();
  }

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
    this.loading = true;
    this.movieService.getMovies().subscribe({
      next: (movies) => {
        this.movies = movies;
        this.filterMovies();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading movies:', err);
        this.alertService.error('Failed to load movies');
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.filterMovies();
  }

  onFilterChange(): void {
    this.filterMovies();
  }

  filterMovies(): void {
    this.filteredMovies = this.movies.filter(movie => {
      const matchesSearch = !this.searchTerm || 
        movie.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (movie.description && movie.description.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesGenre = !this.selectedGenre || 
        (movie.genre && movie.genre.includes(this.selectedGenre));
      
      // Note: Backend uses numeric rating, frontend might use string
      const matchesRating = !this.selectedRating || 
        (movie.rating && movie.rating.toString() === this.selectedRating);
      
      return matchesSearch && matchesGenre && matchesRating;
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
      this.deletingId = movie.id;
      this.movieService.deleteMovie(movie.id).subscribe({
        next: () => {
          this.alertService.success('Movie deleted successfully!');
          this.loadMovies(); // Reload to reflect changes
          this.deletingId = null;
        },
        error: (err) => {
          console.error('Error deleting movie:', err);
          this.alertService.error('Failed to delete movie');
          this.deletingId = null;
        }
      });
    }
  }

  toggleMovieStatus(movie: Movie): void {
    const updatedMovie = { ...movie, isActive: !movie.isActive };
    this.movieService.updateMovie(movie.id, updatedMovie).subscribe({
      next: () => {
        this.alertService.success(`Movie ${updatedMovie.isActive ? 'activated' : 'deactivated'} successfully!`);
        this.loadMovies(); // Reload to reflect changes
      },
      error: (err) => {
        console.error('Error updating movie status:', err);
        this.alertService.error('Failed to update movie status');
      }
    });
  }
}
