import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';

@Component({
  selector: 'app-booking-summary',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './booking-summary.component.html',
  styleUrls: ['./booking-summary.component.css']
})
export class BookingSummaryComponent implements OnInit {
  bookingData: any = null;

  constructor(
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.bookingData = this.bookingService.getCurrentBooking();
    if (!this.bookingData) {
      this.router.navigate(['/user/home']);
    }
  }

  proceedToPayment(): void {
    this.router.navigate(['/user/payment']);
  }

  goBack(): void {
    this.router.navigate(['/user/movie', this.bookingData?.movieId, 'seat-booking']);
  }
}