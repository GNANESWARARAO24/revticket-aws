import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../../core/services/movie.service';
import { Movie } from '../../../core/models/movie.model';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { MovieCardComponent } from '../../../shared/components/movie-card/movie-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, MovieCardComponent, LoaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  movies: Movie[] = [];
  filteredMovies: Movie[] = [];
  loading = true;
  searchTerm = '';
  selectedGenre = 'All';
  genres: string[] = ['All'];

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.movieService.getMovies().subscribe({
      next: (movies) => {
        this.movies = movies.filter(movie => movie.isActive);
        this.filteredMovies = this.movies;
        this.extractGenres();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading movies:', error);
        this.loading = false;
      }
    });
  }

  extractGenres(): void {
    const allGenres = new Set<string>();
    this.movies.forEach(movie => {
      movie.genre.forEach(genre => allGenres.add(genre));
    });
    this.genres = ['All', ...Array.from(allGenres).sort()];
  }

  onSearch(): void {
    this.filterMovies();
  }

  onGenreFilter(genre: string): void {
    this.selectedGenre = genre;
    this.filterMovies();
  }

  private filterMovies(): void {
    this.filteredMovies = this.movies.filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           movie.genre.some(g => g.toLowerCase().includes(this.searchTerm.toLowerCase()));
      const matchesGenre = this.selectedGenre === 'All' || movie.genre.includes(this.selectedGenre);
      return matchesSearch && matchesGenre;
    });
  }
}