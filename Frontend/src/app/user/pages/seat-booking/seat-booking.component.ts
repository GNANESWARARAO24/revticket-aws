import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../../core/services/movie.service';
import { Movie } from '../../../core/models/movie.model';
import { SeatSelectorComponent } from '../../components/seat-selector/seat-selector.component';



@Component({
  selector: 'app-seat-booking',
  standalone: true,
  imports: [CommonModule, SeatSelectorComponent],
  templateUrl: './seat-booking.component.html',
  styleUrl: './seat-booking.component.css'
})
export class SeatBookingComponent implements OnInit {
  movie: Movie | null = null;
  selectedSeats: string[] = [];
  totalAmount = 0;
  showtimeId = 'showtime-123';
  showtime = '7:00 PM';
  showDate = 'Today';
  theater = 'PVR Cinemas - Mall Road';
  screen = 'Screen 1';
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    const movieId = this.route.snapshot.paramMap.get('id') || this.route.snapshot.paramMap.get('showtimeId');
    console.log('Movie ID from route:', movieId);
    if (movieId) {
      this.loadMovie(movieId);
    } else {
      // Default movie for testing
      this.loadMovie('1');
    }
    this.showtimeId = this.route.snapshot.queryParams['showtimeId'] || 'showtime-123';
  }

  loadMovie(id: string): void {
    console.log('Loading movie with ID:', id);
    this.movieService.getMovieById(id).subscribe({
      next: (movie) => {
        console.log('Movie loaded:', movie);
        this.movie = movie;
      },
      error: (error) => {
        console.error('Error loading movie:', error);
        // Load default movie on error
        this.movieService.getMovieById('1').subscribe(defaultMovie => {
          this.movie = defaultMovie;
        });
      }
    });
  }

  onSeatsSelected(seats: string[]): void {
    this.selectedSeats = seats;
    console.log('Seats selected:', seats);
  }

  onTotalAmountChanged(amount: number): void {
    this.totalAmount = amount;
    console.log('Total amount:', amount);
  }





  proceedToPayment(): void {
    console.log('Proceed to payment clicked. Selected seats:', this.selectedSeats);
    console.log('Total amount:', this.totalAmount);
    
    if (this.selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }
    
    if (!this.movie) {
      alert('Movie information not loaded');
      return;
    }
    
    const bookingData = {
      movieId: this.movie.id,
      movieTitle: this.movie.title,
      showtimeId: this.showtimeId,
      showtime: this.showtime,
      showDate: this.showDate,
      theater: this.theater,
      screen: this.screen,
      selectedSeats: [...this.selectedSeats],
      totalAmount: this.totalAmount
    };
    
    console.log('Booking data:', bookingData);
    localStorage.setItem('bookingData', JSON.stringify(bookingData));
    
    console.log('Navigating to payment...');
    this.router.navigate(['/user/payment']).then(success => {
      console.log('Navigation success:', success);
    }).catch(error => {
      console.error('Navigation error:', error);
    });
  }
}