import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from '../../../core/models/movie.model';
import { MovieService } from '../../../core/services/movie.service';
import { Showtime, ShowtimeService } from '../../../core/services/showtime.service';
import { DateSelectorComponent } from '../../components/date-selector/date-selector.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-showtimes',
  standalone: true,
  imports: [CommonModule, DateSelectorComponent, LoaderComponent],
  templateUrl: './showtimes.component.html',
  styleUrls: ['./showtimes.component.css']
})
export class ShowtimesComponent implements OnInit {
  movie = signal<Movie | null>(null);
  movieId = signal('');
  movieSlug = signal('');
  showtimes = signal<Showtime[]>([]);
  loadingMovie = signal(true);
  loadingShowtimes = signal(true);
  selectedDate = signal(new Date());
  errorMessage = signal('');
  
  groupedShowtimes = computed(() => {
    const grouped: { [key: string]: Showtime[] } = {};
    this.showtimes().forEach(showtime => {
      const theaterName = showtime.theater?.name || 'Theater';
      if (!grouped[theaterName]) {
        grouped[theaterName] = [];
      }
      grouped[theaterName].push(showtime);
    });
    return grouped;
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private showtimeService: ShowtimeService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    const slug = this.route.snapshot.paramMap.get('slug') || '';
    
    this.movieId.set(id);
    this.movieSlug.set(slug);
    
    if (!id) {
      this.alertService.error('Movie not found');
      this.router.navigate(['/user/home']);
      return;
    }

    this.loadMovie();
    this.loadShowtimes();
  }

  onDateSelected(date: Date): void {
    this.selectedDate.set(date);
    this.loadShowtimes();
  }

  selectShowtime(showtime: Showtime): void {
    this.router.navigate(['/user/booking', showtime.id]);
  }

  getTheaterName(showtime: Showtime): string {
    return showtime.theater?.name || 'Theater';
  }

  getTheaterLocation(showtime: Showtime): string {
    return showtime.theater?.location || '';
  }

  getAvailabilityPercent(showtime: Showtime): number {
    if (!showtime.totalSeats) {
      return 0;
    }
    return ((showtime.totalSeats - showtime.availableSeats) / showtime.totalSeats) * 100;
  }

  getTheaterKeys(): string[] {
    return Object.keys(this.groupedShowtimes());
  }

  trackByShowId(_index: number, showtime: Showtime): string {
    return showtime.id;
  }

  trackByTheater(_index: number, theater: string): string {
    return theater;
  }

  private loadMovie(): void {
    this.loadingMovie.set(true);
    this.movieService.getMovieById(this.movieId()).subscribe({
      next: movie => {
        this.movie.set(movie);
        this.loadingMovie.set(false);
      },
      error: () => {
        this.alertService.error('Unable to load movie details');
        this.loadingMovie.set(false);
        this.router.navigate(['/user/home']);
      }
    });
  }

  private loadShowtimes(): void {
    this.loadingShowtimes.set(true);
    const dateParam = this.formatDate(this.selectedDate());

    this.showtimeService.getShowtimesByMovie(this.movieId(), dateParam).subscribe({
      next: showtimes => {
        const activeShowtimes = showtimes.filter(s => s.status === 'ACTIVE');
        this.showtimes.set(activeShowtimes);
        this.errorMessage.set(activeShowtimes.length ? '' : 'No showtimes available for this date.');
        this.loadingShowtimes.set(false);
      },
      error: () => {
        this.alertService.error('Failed to load showtimes');
        this.loadingShowtimes.set(false);
        this.errorMessage.set('Unable to fetch showtimes right now. Please try again later.');
      }
    });
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
