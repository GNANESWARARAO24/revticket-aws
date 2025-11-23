import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MovieService } from '../../../core/services/movie.service';
import { AlertService } from '../../../core/services/alert.service';
import { Movie } from '../../../core/models/movie.model';

@Component({
  selector: 'app-add-movie',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css']
})
export class AddMovieComponent implements OnInit {
  movieForm: FormGroup;
  isEditMode = false;
  editingMovieId: string | null = null;
  loading = false;
  submitting = false;

  genreOptions = ['Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Fantasy', 'Animation'];

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private route: ActivatedRoute,
    private movieService: MovieService,
    private alertService: AlertService
  ) {
    this.movieForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      duration: ['', [Validators.required, Validators.min(1)]],
      rating: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
      genre: ['', Validators.required],
      language: ['English', Validators.required],
      releaseDate: ['', Validators.required],
      posterUrl: [''],
      trailerUrl: ['']
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['edit']) {
        this.isEditMode = true;
        this.editingMovieId = params['edit'];
        this.loadMovieForEdit();
      }
    });
  }

  loadMovieForEdit(): void {
    if (!this.editingMovieId) return;

    this.loading = true;
    this.movieService.getMovieById(this.editingMovieId).subscribe({
      next: (movie) => {
        this.movieForm.patchValue({
          title: movie.title,
          description: movie.description || '',
          duration: movie.duration,
          rating: movie.rating,
          genre: Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre || '',
          language: movie.language || 'English',
          releaseDate: movie.releaseDate ? new Date(movie.releaseDate).toISOString().split('T')[0] : '',
          posterUrl: movie.posterUrl || '',
          trailerUrl: movie.trailerUrl || ''
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading movie:', err);
        this.alertService.error('Failed to load movie details');
        this.loading = false;
        this.router.navigate(['/admin/manage-movies']);
      }
    });
  }

  onSubmit(): void {
    if (this.movieForm.valid) {
      this.submitting = true;
      const formValue = this.movieForm.value;
      
      // Convert genre string to array
      const genreArray = formValue.genre
        ? formValue.genre.split(',').map((g: string) => g.trim()).filter((g: string) => g.length > 0)
        : [];

      const movieData: Partial<Movie> = {
        title: formValue.title,
        description: formValue.description,
        duration: parseInt(formValue.duration),
        rating: parseFloat(formValue.rating),
        genre: genreArray,
        language: formValue.language,
        releaseDate: new Date(formValue.releaseDate),
        posterUrl: formValue.posterUrl || undefined,
        trailerUrl: formValue.trailerUrl || undefined,
        isActive: true
      };

      if (this.isEditMode && this.editingMovieId) {
        this.movieService.updateMovie(this.editingMovieId, movieData).subscribe({
          next: () => {
            this.alertService.success('Movie updated successfully!');
            this.submitting = false;
            this.router.navigate(['/admin/manage-movies']);
          },
          error: (err) => {
            console.error('Error updating movie:', err);
            this.alertService.error('Failed to update movie');
            this.submitting = false;
          }
        });
      } else {
        this.movieService.addMovie(movieData).subscribe({
          next: () => {
            this.alertService.success('Movie added successfully!');
            this.submitting = false;
            this.router.navigate(['/admin/manage-movies']);
          },
          error: (err) => {
            console.error('Error adding movie:', err);
            this.alertService.error('Failed to add movie');
            this.submitting = false;
          }
        });
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.movieForm.controls).forEach(key => {
        this.movieForm.get(key)?.markAsTouched();
      });
      this.alertService.error('Please fill all required fields correctly');
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/manage-movies']);
  }

  getPageTitle(): string {
    return this.isEditMode ? 'Edit Movie' : 'Add New Movie';
  }

  getSubmitButtonText(): string {
    return this.isEditMode ? 'Update Movie' : 'Add Movie';
  }

  getFieldError(fieldName: string): string {
    const field = this.movieForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field?.hasError('minlength')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is too short`;
    }
    if (field?.hasError('min')) {
      return `Value must be greater than ${field.errors?.['min'].min}`;
    }
    if (field?.hasError('max')) {
      return `Value must be less than ${field.errors?.['max'].max}`;
    }
    return '';
  }
}
