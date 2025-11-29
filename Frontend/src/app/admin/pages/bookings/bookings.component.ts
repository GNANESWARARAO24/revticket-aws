import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../core/services/booking.service';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  private bookingService = inject(BookingService);
  private alertService = inject(AlertService);

  bookings = signal<any[]>([]);
  filteredBookings = signal<any[]>([]);
  loading = signal(true);
  searchTerm = signal('');
  filterStatus = signal('ALL');

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading.set(true);
    this.bookingService.getAllBookings().subscribe({
      next: (bookings) => {
        this.bookings.set(bookings);
        this.applyFilters();
        this.loading.set(false);
      },
      error: () => {
        this.alertService.error('Failed to load bookings');
        this.loading.set(false);
      }
    });
  }

  applyFilters(): void {
    let filtered = this.bookings();

    if (this.filterStatus() !== 'ALL') {
      filtered = filtered.filter(b => b.status === this.filterStatus());
    }

    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      filtered = filtered.filter(b =>
        b.movieTitle?.toLowerCase().includes(term) ||
        b.userName?.toLowerCase().includes(term) ||
        b.bookingId?.toLowerCase().includes(term)
      );
    }

    this.filteredBookings.set(filtered);
  }

  searchBookings(term: string): void {
    this.searchTerm.set(term);
    this.applyFilters();
  }

  filterByStatus(status: string): void {
    this.filterStatus.set(status);
    this.applyFilters();
  }

  cancelBooking(bookingId: string): void {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    this.bookingService.cancelBooking(bookingId).subscribe({
      next: () => {
        this.alertService.success('Booking cancelled successfully');
        this.loadBookings();
      },
      error: () => {
        this.alertService.error('Failed to cancel booking');
      }
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }
}
