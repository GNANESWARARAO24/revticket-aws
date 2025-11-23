import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../core/services/alert.service';
import { BookingService } from '../../../core/services/booking.service';
import { Booking } from '../../../core/models/booking.model';
import { ETicketComponent } from '../../components/e-ticket/e-ticket.component';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ETicketComponent],
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent implements OnInit {
  bookings = [
    {
      id: 'BK001',
      movie: { title: 'Avengers: Endgame', genre: 'Action', rating: 'UA', duration: 181, posterUrl: 'assets/images/movies/avengers-endgame.png' },
      theater: { name: 'PVR Cinemas' },
      screen: 'Screen 1',
      showtime: new Date('2024-12-25T19:30:00'),
      seats: ['A1', 'A2'],
      totalAmount: 475,
      paymentMethod: 'Credit Card',
      status: 'Confirmed'
    },
    {
      id: 'BK002',
      movie: { title: 'Spider-Man: No Way Home', genre: 'Action', rating: 'UA', duration: 148, posterUrl: 'assets/images/movies/spiderman-nwh.png' },
      theater: { name: 'INOX Multiplex' },
      screen: 'Screen 2',
      showtime: new Date('2024-12-30T16:00:00'),
      seats: ['B5', 'B6'],
      totalAmount: 400,
      paymentMethod: 'UPI',
      status: 'Confirmed'
    }
  ];

  filteredBookings = [...this.bookings];
  activeFilter = 'all';
  searchTerm = '';

  constructor(
    private alertService: AlertService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.filterBookings();
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
    this.filterBookings();
  }

  onSearch(): void {
    this.filterBookings();
  }

  filterBookings(): void {
    let filtered = [...this.bookings];

    // Filter by status
    if (this.activeFilter !== 'all') {
      const now = new Date();
      switch (this.activeFilter) {
        case 'upcoming':
          filtered = filtered.filter(b => new Date(b.showtime) > now && b.status === 'Confirmed');
          break;
        case 'past':
          filtered = filtered.filter(b => new Date(b.showtime) < now);
          break;
        case 'cancelled':
          filtered = filtered.filter(b => b.status === 'Cancelled');
          break;
      }
    }

    // Filter by search term
    if (this.searchTerm) {
      filtered = filtered.filter(b => 
        b.movie.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        b.theater.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.filteredBookings = filtered;
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/movies/default-poster.png';
  }

  selectedBooking: any = null;
  showTicket = false;

  downloadTicket(booking: any): void {
    this.alertService.success('Ticket downloaded successfully!');
  }

  viewTicket(booking: any): void {
    this.selectedBooking = booking;
    this.showTicket = true;
  }

  closeTicket(): void {
    this.showTicket = false;
    this.selectedBooking = null;
  }

  viewDetails(booking: any): void {
    this.alertService.info('Viewing booking details...');
  }

  canCancel(booking: any): boolean {
    const showtime = new Date(booking.showtime);
    const now = new Date();
    const timeDiff = showtime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    return hoursDiff > 2; // Can cancel if more than 2 hours before showtime
  }

  cancelBooking(booking: any): void {
    const reason = prompt('Please provide a reason for cancellation:');
    if (!reason) return;

    const confirmMessage = `Are you sure you want to cancel this booking?\n\nMovie: ${booking.movie.title}\nDate: ${new Date(booking.showtime).toLocaleDateString()}\nSeats: ${booking.seats.join(', ')}\nAmount: ₹${booking.totalAmount}\n\nReason: ${reason}\n\nThis action cannot be undone.`;
    
    if (confirm(confirmMessage)) {
      // Calculate refund based on time remaining
      const refundAmount = this.calculateRefund(booking);
      booking.status = 'Cancelled';
      booking.refundAmount = refundAmount;
      booking.refundDate = new Date();
      booking.cancellationReason = reason;
      
      this.alertService.success(`Booking #${booking.id} cancelled successfully! Refund amount: ₹${refundAmount}. Refund will be processed within 3-5 business days.`);
      this.filterBookings();
    }
  }

  calculateRefund(booking: any): number {
    const showDate = new Date(booking.showtime);
    const now = new Date();
    const hoursUntilShow = (showDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilShow > 24) return booking.totalAmount * 0.9; // 90% refund
    if (hoursUntilShow > 4) return booking.totalAmount * 0.5;  // 50% refund
    return 0; // No refund
  }

  getRefundInfo(booking: any): string {
    if (!booking.refundAmount) return '';
    return `Refunded: ₹${booking.refundAmount} on ${new Date(booking.refundDate).toLocaleDateString()}`;
  }

  getEmptyStateMessage(): string {
    switch (this.activeFilter) {
      case 'upcoming': return 'No upcoming bookings found';
      case 'past': return 'No past bookings found';
      case 'cancelled': return 'No cancelled bookings found';
      default: return this.searchTerm ? 'No bookings match your search' : 'No bookings found. Book your first movie!';
    }
  }
}