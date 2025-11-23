import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../../core/services/movie.service';
import { Movie, Showtime } from '../../../core/models/movie.model';

@Component({
  selector: 'app-showtimes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './showtimes.component.html',
  styleUrls: ['./showtimes.component.css']
})
export class ShowtimesComponent implements OnInit {
  movie: Movie | null = null;
  showtimes: Showtime[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    const movieId = this.route.snapshot.paramMap.get('id');
    if (movieId) {
      this.movieService.getMovieById(movieId).subscribe(movie => {
        this.movie = movie;
      });
      this.loadShowtimes(movieId);
    }
  }

  loadShowtimes(movieId: string): void {
    // Mock showtimes
    this.showtimes = [
      {
        id: '1',
        movieId,
        theaterId: '1',
        theaterName: 'PVR Cinemas',
        theaterIcon: 'assets/images/theaters/PVR.png',
        showDate: new Date(),
        showTime: '10:00 AM',
        price: 200,
        availableSeats: 45,
        totalSeats: 100
      },
      {
        id: '2',
        movieId,
        theaterId: '2',
        theaterName: 'INOX',
        theaterIcon: 'assets/images/theaters/inox.png',
        showDate: new Date(),
        showTime: '2:00 PM',
        price: 250,
        availableSeats: 30,
        totalSeats: 80
      },
      {
        id: '3',
        movieId,
        theaterId: '3',
        theaterName: 'Cinepolis',
        theaterIcon: 'assets/images/theaters/cinepolis.png',
        showDate: new Date(),
        showTime: '7:00 PM',
        price: 300,
        availableSeats: 60,
        totalSeats: 120
      }
    ];
  }

  selectShowtime(showtime: Showtime): void {
    this.router.navigate(['/user/booking', showtime.id]);
  }

  onImageError(event: any, showtime: any): void {
    event.target.src = 'https://via.placeholder.com/40x40/667eea/ffffff?text=' + encodeURIComponent(showtime.theaterName.charAt(0));
  }
}