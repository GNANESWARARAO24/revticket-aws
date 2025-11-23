import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AddMovieComponent } from './pages/add-movie/add-movie.component';
import { ManageMoviesComponent } from './pages/manage-movies/manage-movies.component';
import { ManageShowsComponent } from './pages/manage-shows/manage-shows.component';
import { BookingsReportComponent } from './pages/bookings-report/bookings-report.component';
import { ManageTheatresComponent } from './pages/manage-theatres/manage-theatres.component';

export const adminRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'add-movie', component: AddMovieComponent },
  { path: 'manage-movies', component: ManageMoviesComponent },
  { path: 'manage-shows', component: ManageShowsComponent },
  { path: 'bookings-report', component: BookingsReportComponent },
  { path: 'manage-theatres', component: ManageTheatresComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];