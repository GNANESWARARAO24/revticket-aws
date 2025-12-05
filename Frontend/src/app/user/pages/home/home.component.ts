import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MovieService } from '../../../core/services/movie.service';
import { AlertService } from '../../../core/services/alert.service';
import { Movie } from '../../../core/models/movie.model';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { HeroSliderComponent } from '../../components/hero-slider/hero-slider.component';
import { MovieCarouselComponent } from '../../components/movie-carousel/movie-carousel.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoaderComponent,
    HeroSliderComponent,
    MovieCarouselComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private movieService = inject(MovieService);
  private alertService = inject(AlertService);
  private router = inject(Router);

  movies = signal<Movie[]>([]);
  loading = signal(true);
  searchTerm = signal('');
  selectedGenre = signal('All');
  
  featuredMovies = computed(() => {
    return this.movies().filter(m => m.rating >= 7).slice(0, 4);
  });
  
  genres = computed(() => {
    const allGenres = this.movies().flatMap(m => m.genre || []);
    return ['All', ...Array.from(new Set(allGenres))];
  });
  
  filteredMovies = computed(() => {
    let filtered = this.movies();
    if (this.selectedGenre() !== 'All') {
      filtered = filtered.filter(m => m.genre?.includes(this.selectedGenre()));
    }
    if (this.searchTerm().trim()) {
      const term = this.searchTerm().toLowerCase();
      filtered = filtered.filter(m => 
        m.title.toLowerCase().includes(term) ||
        m.genre.some(g => g.toLowerCase().includes(term))
      );
    }
    return filtered;
  });

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading.set(true);
    this.movieService.getMovies().subscribe({
      next: (movies) => {
        const activeMovies = movies.filter(movie => movie.isActive);
        this.movies.set(activeMovies);
        this.loading.set(false);
      },
      error: () => {
        this.alertService.error('Failed to load movies. Please try again.');
        this.loading.set(false);
      }
    });
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
  }

  onGenreFilter(genre: string): void {
    this.selectedGenre.set(genre);
  }

  getMoviesSectionTitle(): string {
    if (this.searchTerm().trim()) {
      return `Search Results (${this.filteredMovies().length})`;
    }
    if (this.selectedGenre() !== 'All') {
      return `${this.selectedGenre()} Movies (${this.filteredMovies().length})`;
    }
    return `Now Showing (${this.filteredMovies().length})`;
  }

  resetFilters(): void {
    this.searchTerm.set('');
    this.selectedGenre.set('All');
  }

  viewDetails(movieId: string): void {
    this.router.navigate(['/user/movie-details', movieId]);
  }
}
