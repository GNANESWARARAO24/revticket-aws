import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../core/services/booking.service';
import { MovieService } from '../../../core/services/movie.service';
import { TheaterService } from '../../../core/services/theater.service';
import { AlertService } from '../../../core/services/alert.service';
import { Booking } from '../../../core/models/booking.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-bookings-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bookings-report.component.html',
  styleUrls: ['./bookings-report.component.css']
})
export class BookingsReportComponent implements OnInit {
  // Filter properties
  fromDate = signal('');
  toDate = signal('');
  selectedMovie = signal('');
  selectedTheater = signal('');
  selectedStatus = signal('');
  searchTerm = signal('');
  weekDayLabels = signal<string[]>([]);

  // Data
  allBookings = signal<Booking[]>([]);
  movies = signal<any[]>([]);
  theaters = signal<any[]>([]);

  // Pagination
  currentPage = signal(1);
  itemsPerPage = signal(10);

  loading = signal(false);
  
  filteredBookings = computed(() => {
    const bookings = this.allBookings();
    const from = this.fromDate();
    const to = this.toDate();
    const movie = this.selectedMovie();
    const theater = this.selectedTheater();
    const status = this.selectedStatus();
    const search = this.searchTerm().toLowerCase();
    
    return bookings.filter(booking => {
      let matchesDate = true;
      if (from && to) {
        const bookingDate = new Date(booking.bookingDate);
        const fromDate = new Date(from);
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        matchesDate = bookingDate >= fromDate && bookingDate <= toDate;
      }

      const matchesSearch = !search || 
        (booking.customerName && booking.customerName.toLowerCase().includes(search)) ||
        (booking.customerEmail && booking.customerEmail.toLowerCase().includes(search)) ||
        (booking.id && booking.id.toLowerCase().includes(search));

      const matchesMovie = !movie || booking.movieTitle === movie;
      const matchesTheater = !theater || booking.theaterName === theater;
      const matchesStatus = !status || booking.status === status;

      return matchesDate && matchesSearch && matchesMovie && matchesTheater && matchesStatus;
    });
  });
  
  totalPages = computed(() => Math.ceil(this.filteredBookings().length / this.itemsPerPage()));
  
  paginatedBookings = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.filteredBookings().slice(start, end);
  });
  
  totalBookings = computed(() => this.filteredBookings().length);
  
  totalRevenue = computed(() => {
    const confirmedBookings = this.filteredBookings().filter(b => b.status === 'CONFIRMED');
    return confirmedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  });
  
  todayBookings = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.filteredBookings().filter(b => {
      const bookingDate = new Date(b.bookingDate);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate.getTime() === today.getTime();
    }).length;
  });
  
  cancelledBookings = computed(() => this.filteredBookings().filter(b => b.status === 'CANCELLED').length);
  
  avgTicketsPerBooking = computed(() => {
    const bookings = this.filteredBookings();
    if (bookings.length === 0) return 0;
    const totalTickets = bookings.reduce((sum, b) => sum + (b.seats?.length || 0), 0);
    return totalTickets / bookings.length;
  });

  constructor(
    private bookingService: BookingService,
    private movieService: MovieService,
    private theaterService: TheaterService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.setDefaultDates();
    this.generateWeekDayLabels();
    this.loadData();
  }

  generateWeekDayLabels(): void {
    const labels: string[] = [];
    const today = new Date();
  
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      labels.push(
        d.toLocaleDateString('en-US', { weekday: 'short' })
      );
    }
  
    this.weekDayLabels.set(labels);
  }

  loadData(): void {
    this.loading.set(true);
    forkJoin({
      bookings: this.bookingService.getAllBookings(),
      movies: this.movieService.getMovies(),
      theaters: this.theaterService.getAllTheaters()
    }).subscribe({
      next: ({ bookings, movies, theaters }) => {
        this.allBookings.set(bookings);
        this.movies.set(movies);
        this.theaters.set(theaters);
        this.loading.set(false);
      },
      error: () => {
        this.alertService.error('Failed to load bookings data');
        this.loading.set(false);
      }
    });
  }

  setDefaultDates(): void {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    
    this.fromDate.set(lastMonth.toISOString().split('T')[0]);
    this.toDate.set(today.toISOString().split('T')[0]);
  }

  onFilterChange(): void {
    this.currentPage.set(1);
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  exportReport(): void {
    this.alertService.info('Export functionality will be available soon!');
  }

  refreshData(): void {
    this.loadData();
    this.alertService.success('Data refreshed successfully!');
  }

  viewBooking(booking: Booking): void {
    this.alertService.info(`Booking ID: ${booking.id}`);
  }

  downloadTicket(booking: Booking): void {
    this.alertService.info(`Download ticket for booking ${booking.id}`);
  }

  getEndIndex(): number {
    return Math.min(this.currentPage() * this.itemsPerPage(), this.filteredBookings().length);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }

  getDailyBookingsData(): number[] {
    const last7Days = [];
    const today = new Date();
    const bookings = this.filteredBookings();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const count = bookings.filter(b => {
        const bookingDate = new Date(b.bookingDate);
        bookingDate.setHours(0, 0, 0, 0);
        return bookingDate.getTime() === date.getTime();
      }).length;
      
      last7Days.push(count);
    }
    
    return last7Days;
  }

  getPopularMovies(): any[] {
    const movieStats = new Map<string, { title: string; bookings: number }>();
    const bookings = this.filteredBookings();
    
    bookings.forEach(booking => {
      const key = booking.movieId || booking.movieTitle;
      const current = movieStats.get(key) || { title: booking.movieTitle, bookings: 0 };
      current.bookings++;
      movieStats.set(key, current);
    });
    
    const sorted = Array.from(movieStats.values())
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 3);
    
    const maxBookings = Math.max(...sorted.map(s => s.bookings), 1);
    
    return sorted.map(stat => ({
      ...stat,
      percentage: (stat.bookings / maxBookings) * 100
    }));
  }

  getMaxBookings(): number {
    const data = this.getDailyBookingsData();
    return Math.max(...data, 1);
  }

  getBarHeight(count: number): string {
    const max = this.getMaxBookings();
    return `${(count / max) * 100}%`;
  }

  trackByBookingId(index: number, booking: Booking): string {
    return booking.id;
  }
}
