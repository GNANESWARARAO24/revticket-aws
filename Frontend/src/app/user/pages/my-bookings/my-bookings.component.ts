import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../core/services/alert.service';
import { BookingService } from '../../../core/services/booking.service';
import { Booking } from '../../../core/models/booking.model';
import { ETicketComponent } from '../../components/e-ticket/e-ticket.component';

type BookingCard = Booking & {
  moviePosterUrl?: string;
};

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ETicketComponent],
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css'],
  providers: [DatePipe]
})
export class MyBookingsComponent implements OnInit {
  bookings = signal<BookingCard[]>([]);
  activeFilter = signal<'all' | 'upcoming' | 'past' | 'cancelled'>('all');
  searchTerm = signal('');
  loading = signal(true);
  selectedBooking = signal<BookingCard | null>(null);
  showTicket = signal(false);
  
  filteredBookings = computed(() => {
    let filtered = [...this.bookings()];
    const now = new Date();
    const filter = this.activeFilter();
    const term = this.searchTerm().toLowerCase();

    if (filter !== 'all') {
      filtered = filtered.filter(booking => {
        const showtime = new Date(booking.showtime);
        switch (filter) {
          case 'upcoming':
            return showtime > now && booking.status === 'CONFIRMED';
          case 'past':
            return showtime <= now;
          case 'cancelled':
            return booking.status === 'CANCELLED';
          default:
            return true;
        }
      });
    }

    if (term) {
      filtered = filtered.filter(booking =>
        booking.movieTitle.toLowerCase().includes(term) ||
        booking.theaterName.toLowerCase().includes(term)
      );
    }

    return filtered;
  });

  private alertService = inject(AlertService);
  private bookingService = inject(BookingService);

  onImageError(event: any): void {
    event.target.src = 'assets/images/movies/default-poster.png';
  }

  ngOnInit(): void {
    this.fetchBookings();
  }

  setFilter(filter: 'all' | 'upcoming' | 'past' | 'cancelled'): void {
    this.activeFilter.set(filter);
  }

  downloadTicket(_booking: BookingCard): void {
    this.alertService.success('Ticket ready to download!');
  }

  viewTicket(booking: BookingCard): void {
    this.selectedBooking.set(booking);
    this.showTicket.set(true);
  }

  closeTicket(): void {
    this.showTicket.set(false);
    this.selectedBooking.set(null);
  }

  viewDetails(_booking: BookingCard): void {
    this.alertService.info('Detailed booking view coming soon.');
  }

  canCancel(booking: BookingCard): boolean {
    if (booking.status !== 'CONFIRMED') {
      return false;
    }
    const showtime = new Date(booking.showtime);
    const now = new Date();
    return showtime.getTime() - now.getTime() > 2 * 60 * 60 * 1000;
  }

  cancelBooking(booking: BookingCard): void {
    const reason = prompt('Please provide a reason for cancellation:');
    if (!reason) {
      return;
    }

    const confirmMessage = `Cancel booking for ${booking.movieTitle} on ${new Date(booking.showtime).toLocaleString()}?\nSeats: ${booking.seats.join(', ')}\nReason: ${reason}`;
    if (!confirm(confirmMessage)) {
      return;
    }

    this.bookingService.cancelBooking(booking.id, reason).subscribe({
      next: updated => {
        const normalized = this.bookingService.normalizeBookingDates(updated);
        this.bookings.update(bookings => bookings.map(b => (b.id === normalized.id ? normalized : b)));
        this.alertService.success('Booking cancelled. Refund (if applicable) will be processed shortly.');
      },
      error: () => this.alertService.error('Unable to cancel booking. Please try again.')
    });
  }

  getRefundInfo(booking: BookingCard): string {
    if (!booking.refundAmount || !booking.refundDate) {
      return '';
    }
    const date = new Date(booking.refundDate).toLocaleDateString();
    return `Refunded ₹${booking.refundAmount} on ${date}`;
  }

  getEmptyStateMessage(): string {
    switch (this.activeFilter()) {
      case 'upcoming':
        return 'No upcoming bookings found.';
      case 'past':
        return 'No past bookings found.';
      case 'cancelled':
        return 'No cancelled bookings found.';
      default:
        return this.searchTerm()
          ? 'No bookings match your search.'
          : 'No bookings yet. Start exploring movies!';
    }
  }

  private fetchBookings(): void {
    this.loading.set(true);
    this.bookingService.getUserBookings().subscribe({
      next: bookings => {
        this.bookings.set(bookings.map(b => this.bookingService.normalizeBookingDates(b)));
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.alertService.error('Unable to load bookings.');
      }
    });
  }
}