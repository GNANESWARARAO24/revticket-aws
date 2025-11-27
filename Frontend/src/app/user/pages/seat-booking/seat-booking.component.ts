import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SeatSelectorComponent } from '../../components/seat-selector/seat-selector.component';
import { Showtime, ShowtimeService } from '../../../core/services/showtime.service';
import { BookingDraft } from '../../../core/models/booking.model';
import { BookingService } from '../../../core/services/booking.service';
import { AlertService } from '../../../core/services/alert.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-seat-booking',
  standalone: true,
  imports: [CommonModule, SeatSelectorComponent, LoaderComponent],
  templateUrl: './seat-booking.component.html',
  styleUrls: ['./seat-booking.component.css']
})
export class SeatBookingComponent implements OnInit {
  showtimeId = signal('');
  showtime = signal<Showtime | null>(null);
  movieInfo = signal({
    title: '',
    posterUrl: '',
    rating: 0,
    duration: 0,
    genre: [] as string[],
    language: ''
  });
  theaterName = signal('');
  theaterLocation = signal('');
  selectedSeats = signal<string[]>([]);
  selectedSeatLabels = signal<string[]>([]);
  totalAmount = signal(0);
  loading = signal(true);
  showDateTime = signal<Date | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private showtimeService: ShowtimeService,
    private bookingService: BookingService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('showtimeId') || '';
    this.showtimeId.set(id);
    if (!id) {
      this.alertService.error('Invalid showtime selected');
      this.router.navigate(['/user/home']);
      return;
    }
    this.loadShowtime();
  }

  onSeatsSelected(seats: string[]): void {
    this.selectedSeats.set(seats);
  }

  onSeatLabelsChanged(labels: string[]): void {
    this.selectedSeatLabels.set(labels);
  }

  onTotalAmountChanged(amount: number): void {
    this.totalAmount.set(amount);
  }

  proceedToPayment(): void {
    if (this.selectedSeats().length === 0) {
      this.alertService.error('Please select at least one seat to continue.');
      return;
    }

    const showtime = this.showtime();
    if (!showtime) {
      this.alertService.error('Showtime information not available.');
      return;
    }

    const movieInfo = this.movieInfo();
    const draft: BookingDraft = {
      showtimeId: this.showtimeId(),
      showDateTime: showtime.showDateTime,
      movieId: showtime.movieId,
      movieTitle: movieInfo.title || 'Movie',
      moviePosterUrl: movieInfo.posterUrl,
      theaterId: showtime.theaterId,
      theaterName: this.theaterName(),
      theaterLocation: this.theaterLocation(),
      screen: showtime.screen,
      seats: [...this.selectedSeatLabels()],
      totalAmount: this.totalAmount()
    };

    this.bookingService.setCurrentBooking(draft);
    this.router.navigate(['/user/booking-summary']);
  }

  private loadShowtime(): void {
    this.loading.set(true);
    this.showtimeService.getShowtimeById(this.showtimeId()).subscribe({
      next: showtime => {
        this.showtime.set(showtime);
        this.showDateTime.set(new Date(showtime.showDateTime));
        this.theaterName.set(showtime.theater?.name || '');
        this.theaterLocation.set(showtime.theater?.location || '');
        this.movieInfo.set({
          title: showtime.movie?.title || '',
          posterUrl: showtime.movie?.posterUrl || '',
          rating: showtime.movie?.rating || 0,
          duration: showtime.movie?.duration || 0,
          genre: showtime.movie?.genre || [],
          language: showtime.movie?.language || ''
        });
        this.loading.set(false);
      },
      error: () => {
        this.alertService.error('Unable to load showtime details');
        this.router.navigate(['/user/home']);
      }
    });
  }
}
