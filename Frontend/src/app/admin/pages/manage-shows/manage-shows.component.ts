import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ShowtimeService } from '../../../core/services/showtime.service';
import { MovieService } from '../../../core/services/movie.service';
import { TheaterService } from '../../../core/services/theater.service';
import { AlertService } from '../../../core/services/alert.service';
import { forkJoin } from 'rxjs';
import { Showtime } from '../../../core/services/showtime.service';

@Component({
  selector: 'app-manage-shows',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './manage-shows.component.html',
  styleUrls: ['./manage-shows.component.css']
})
export class ManageShowsComponent implements OnInit {
  shows: any[] = [];
  filteredShows: any[] = [];
  movies: any[] = [];
  theaters: any[] = [];
  
  searchTerm = '';
  selectedMovie = '';
  selectedTheater = '';
  selectedDate = '';
  showAddForm = false;
  isEditMode = false;
  editingShowId: string | null = null;
  loading = false;
  submitting = false;
  
  newShow = {
    movieId: '',
    theaterId: '',
    screen: '',
    showDateTime: '',
    ticketPrice: 0,
    totalSeats: 0,
    status: 'ACTIVE'
  };

  constructor(
    private showtimeService: ShowtimeService,
    private movieService: MovieService,
    private theaterService: TheaterService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }


  loadData(): void {
    this.loading = true;
  
    forkJoin({
      movies: this.movieService.getMovies(),
      theaters: this.theaterService.getAllTheaters()
    }).subscribe({
      next: ({ movies, theaters }) => {
  
        // 🔥 Normalize Movies
        this.movies = movies.map((m: any) => ({
          id: m.id || m._id,
          title: m.title || m.name,
          genre: m.genre || m.genres || [],
          duration: m.duration || 0,
          rating: m.rating || 0,
          posterUrl: m.posterUrl || m.image || ''
        }));
  
        // 🔥 Normalize Theaters
        this.theaters = theaters.map((t: any) => ({
          id: t.id || t._id,
          name: t.name,
          location: t.location || ''
        }));
  
        this.loadShows();
      },
  
      error: () => {
        this.alertService.error('Failed to load data');
        this.loading = false;
      }
    });
  }

  // loadData(): void {
  //   this.loading = true;
  //   forkJoin({
  //     movies: this.movieService.getMovies(),
  //     theaters: this.theaterService.getAllTheaters()
  //   }).subscribe({
  //     next: ({ movies, theaters }) => {
  //       this.movies = movies;
  //       this.theaters = theaters;
  //       this.loadShows();
  //     },
  //     error: (err) => {
  //       console.error('Error loading data:', err);
  //       this.alertService.error('Failed to load data');
  //       this.loading = false;
  //     }
  //   });
  // }

  loadShows(): void {
    // Load all showtimes - in production, you'd have an endpoint for all showtimes
    // For now, we'll get showtimes for each movie
    const showtimePromises = this.movies.map(movie => 
      this.showtimeService.getShowtimesByMovie(movie.id)
    );

    Promise.all(showtimePromises.map(p => p.toPromise())).then(results => {
      this.shows = [];
      results.forEach((showtimes: any, index) => {
        if (showtimes && showtimes.length > 0) {
          showtimes.forEach((st: any) => {
            this.shows.push({
              id: st.id,
              movie: {
                title: this.movies[index]?.title || 'Unknown',
                genre: this.movies[index]?.genre || [],
                duration: this.movies[index]?.duration || 0,
                rating: this.movies[index]?.rating || 0,
                posterUrl: this.movies[index]?.posterUrl || ''
              },
              theater: {
                name: this.theaters.find(t => t.id === st.theaterId)?.name || 'Unknown'
              },
              screen: st.screen,
              showtime: new Date(st.showDateTime),
              ticketPrice: st.ticketPrice,
              totalSeats: st.totalSeats,
              availableSeats: st.availableSeats,
              status: st.status
            });
          });
        }
      });
      this.filterShows();
      this.loading = false;
    }).catch(err => {
      console.error('Error loading showtimes:', err);
      this.loading = false;
    });
  }

  onSearch(): void {
    this.filterShows();
  }

  onFilterChange(): void {
    this.filterShows();
  }

  filterShows(): void {
    this.filteredShows = this.shows.filter(show => {
      const matchesSearch = !this.searchTerm || 
        show.movie.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        show.theater.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesMovie = !this.selectedMovie || show.movie.title === this.selectedMovie;
      const matchesTheater = !this.selectedTheater || show.theater.name === this.selectedTheater;
      
      let matchesDate = true;
      if (this.selectedDate) {
        const showDate = new Date(show.showtime).toDateString();
        const filterDate = new Date(this.selectedDate).toDateString();
        matchesDate = showDate === filterDate;
      }
      
      return matchesSearch && matchesMovie && matchesTheater && matchesDate;
    });
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/movies/default-poster.png';
  }

  addNewShow(): void {
    this.isEditMode = false;
    this.editingShowId = null;
    this.showAddForm = true;
    this.resetForm();
  }

  resetForm(): void {
    this.newShow = {
      movieId: '',
      theaterId: '',
      screen: '',
      showDateTime: '',
      ticketPrice: 0,
      totalSeats: 0,
      status: 'ACTIVE'
    };
  }

  saveShow(): void {
    if (this.validateForm()) {
      this.submitting = true;
      const showtimeData: Partial<Showtime> = {
        movieId: this.newShow.movieId,
        theaterId: this.newShow.theaterId,
        screen: this.newShow.screen,
        showDateTime: new Date(this.newShow.showDateTime),
        ticketPrice: this.newShow.ticketPrice,
        totalSeats: this.newShow.totalSeats,
        availableSeats: this.newShow.totalSeats,
        status: this.newShow.status as any
      };

      if (this.isEditMode && this.editingShowId) {
        this.showtimeService.updateShowtime(this.editingShowId, showtimeData).subscribe({
          next: () => {
            this.alertService.success('Show updated successfully!');
            this.submitting = false;
            this.loadShows();
            this.cancelAdd();
          },
          error: (err) => {
            console.error('Error updating show:', err);
            this.alertService.error('Failed to update show');
            this.submitting = false;
          }
        });
      } else {
        this.showtimeService.createShowtime(showtimeData).subscribe({
          next: () => {
            this.alertService.success('Show added successfully!');
            this.submitting = false;
            this.loadShows();
            this.cancelAdd();
          },
          error: (err) => {
            console.error('Error creating show:', err);
            this.alertService.error('Failed to create show');
            this.submitting = false;
          }
        });
      }
    }
  }

  validateForm(): boolean {
    if (!this.newShow.movieId || !this.newShow.theaterId || 
        !this.newShow.screen || !this.newShow.showDateTime ||
        this.newShow.ticketPrice <= 0 || this.newShow.totalSeats <= 0) {
      this.alertService.error('Please fill all required fields');
      return false;
    }
    return true;
  }

  cancelAdd(): void {
    this.showAddForm = false;
    this.isEditMode = false;
    this.editingShowId = null;
    this.resetForm();
  }

  editShow(show: any): void {
    this.isEditMode = true;
    this.editingShowId = show.id;
    this.showAddForm = true;
    
    // Find movie and theater IDs
    const movie = this.movies.find(m => m.title === show.movie.title);
    const theater = this.theaters.find(t => t.name === show.theater.name);
    
    const showDateTime = new Date(show.showtime);
    const formattedDateTime = showDateTime.toISOString().slice(0, 16);
    
    this.newShow = {
      movieId: movie?.id || '',
      theaterId: theater?.id || '',
      screen: show.screen,
      showDateTime: formattedDateTime,
      ticketPrice: show.ticketPrice,
      totalSeats: show.totalSeats,
      status: show.status
    };
  }

  viewBookings(show: any): void {
    this.alertService.info(`View bookings for: ${show.movie.title}`);
  }

  deleteShow(show: any): void {
    if (confirm(`Are you sure you want to delete the show "${show.movie.title}" at ${show.theater.name}?`)) {
      this.showtimeService.deleteShowtime(show.id).subscribe({
        next: () => {
          this.alertService.success('Show deleted successfully!');
          this.loadShows();
        },
        error: (err) => {
          console.error('Error deleting show:', err);
          this.alertService.error('Failed to delete show');
        }
      });
    }
  }

  hasFilters(): boolean {
    return !!(this.searchTerm || this.selectedMovie || this.selectedTheater || this.selectedDate);
  }

  getEmptyStateMessage(): string {
    if (this.hasFilters()) {
      return 'No shows match your current filters. Try adjusting your search criteria.';
    }
    return 'No shows scheduled yet. Start by adding your first show.';
  }
}
