import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { MovieService } from '../../../core/services/movie.service';
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
  private router = inject(Router);
  private movieService = inject(MovieService);
  private alertService = inject(AlertService);

  movies = signal<Movie[]>([]);
  searchTerm = signal('');
  selectedGenre = signal('');
  showInactive = signal(false);
  loading = signal(false);
  deletingId = signal<string | null>(null);
  sortField = signal<string>('');
  sortDir = signal<'asc' | 'desc'>('asc');
  togglingStatusId = signal<string | null>(null);
  
  availableGenres = computed(() => {
    const genres = new Set<string>();
    this.movies().forEach(movie => {
      movie.genre?.forEach(g => genres.add(g));
    });
    return Array.from(genres).sort();
  });

  filteredMovies = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const genre = this.selectedGenre();
    const showInactive = this.showInactive();
    const sortField = this.sortField();
    const sortDir = this.sortDir();
    
    let filtered = this.movies().filter(movie => {
      const matchesSearch = !search || 
        movie.title?.toLowerCase().includes(search) ||
        (movie.description && movie.description.toLowerCase().includes(search));
      
      const matchesGenre = !genre || 
        (movie.genre && movie.genre.includes(genre));
      
      const matchesStatus = showInactive || movie.isActive;
      
      return matchesSearch && matchesGenre && matchesStatus;
    });

    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        let aVal: any = a[sortField as keyof Movie];
        let bVal: any = b[sortField as keyof Movie];

        if (sortField === 'releaseDate') {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }

        if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  });

  toggleInactiveFilter(): void {
    this.showInactive.set(!this.showInactive());
  }

  getDirector(movie: Movie): string {
    return movie.director || 'N/A';
  }

  formatReleaseDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading.set(true);
    this.movieService.getAdminMovies().subscribe({
      next: (movies) => {
        this.movies.set(movies);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading movies:', err);
        this.alertService.error('Failed to load movies');
        this.loading.set(false);
      }
    });
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/movies/default-poster.png';
  }

  editMovie(movie: Movie): void {
    this.router.navigate(['/admin/add-movie'], { 
      queryParams: { id: movie.id } 
    });
  }

  deleteMovie(movie: Movie): void {
    if (confirm(`Are you sure you want to delete "${movie.title}"?\n\nThis action cannot be undone and will remove all associated showtimes.`)) {
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

  sortBy(field: string): void {
    if (this.sortField() === field) {
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDir.set('asc');
    }
  }

  onHeaderKeydown(event: KeyboardEvent, field: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.sortBy(field);
    }
  }

  toggleMovieStatus(movie: Movie, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    const previousState = movie.isActive;
    const movieIndex = this.movies().findIndex(m => m.id === movie.id);
    
    if (movieIndex === -1) return;

    this.togglingStatusId.set(movie.id);
    
    // Optimistic update
    const updatedMovies = [...this.movies()];
    updatedMovies[movieIndex] = { ...movie, isActive: !previousState };
    this.movies.set(updatedMovies);

    this.movieService.toggleMovieStatus(movie.id).subscribe({
      next: (updatedMovie) => {
        this.togglingStatusId.set(null);
        const movies = [...this.movies()];
        const idx = movies.findIndex(m => m.id === movie.id);
        if (idx !== -1) {
          movies[idx] = updatedMovie;
          this.movies.set(movies);
        }
        this.alertService.success(`Movie ${updatedMovie.isActive ? 'activated' : 'deactivated'} successfully!`);
      },
      error: () => {
        this.togglingStatusId.set(null);
        // Rollback on error
        const movies = [...this.movies()];
        const idx = movies.findIndex(m => m.id === movie.id);
        if (idx !== -1) {
          movies[idx] = { ...movie, isActive: previousState };
          this.movies.set(movies);
        }
        this.alertService.error('Failed to update movie status');
      }
    });
  }

  onStatusKeydown(event: KeyboardEvent, movie: Movie): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleMovieStatus(movie);
    }
  }

  trackById(index: number, item: any): string {
    return item?.id || index.toString();
  }
}
