import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
import { ShowtimesComponent } from './pages/showtimes/showtimes.component';
import { SeatBookingComponent } from './pages/seat-booking/seat-booking.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { BookingSuccessComponent } from './pages/booking-success/booking-success.component';
import { MyBookingsComponent } from './pages/my-bookings/my-bookings.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { BookingSummaryComponent } from './pages/booking-summary/booking-summary.component';

export const userRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'movie/:id/:slug', component: MovieDetailsComponent },
  { path: 'movie/:id/:slug/showtimes', component: ShowtimesComponent, canActivate: [authGuard] },
  { path: 'movie/:id/showtimes', redirectTo: 'movie/:id/movie/showtimes', pathMatch: 'full' },
  { path: 'movie/:id', redirectTo: 'movie/:id/movie', pathMatch: 'full' },
  { path: 'booking/:showtimeId', component: SeatBookingComponent, canActivate: [authGuard] },
  { path: 'payment', component: PaymentComponent, canActivate: [authGuard] },
  { path: 'success/:bookingId', component: BookingSuccessComponent, canActivate: [authGuard] },
  { path: 'my-bookings', component: MyBookingsComponent, canActivate: [authGuard] },
  { path: 'booking-summary', component: BookingSummaryComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];