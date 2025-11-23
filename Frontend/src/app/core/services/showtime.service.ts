import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Showtime {
  id: string;
  movieId: string;
  theaterId: string;
  screen: string;
  showDateTime: Date;
  ticketPrice: number;
  totalSeats: number;
  availableSeats: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  movie?: {
    id: string;
    title: string;
    genre?: string[];
    duration?: number;
    rating?: number;
    posterUrl?: string;
  };
  theater?: {
    id: string;
    name: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ShowtimeService {
  constructor(private http: HttpClient) {}

  getShowtimesByMovie(movieId: string, date?: string): Observable<Showtime[]> {
    const url = date 
      ? `${environment.apiUrl}/showtimes/movie/${movieId}?date=${date}`
      : `${environment.apiUrl}/showtimes/movie/${movieId}`;
    return this.http.get<Showtime[]>(url);
  }

  getShowtimeById(id: string): Observable<Showtime> {
    return this.http.get<Showtime>(`${environment.apiUrl}/showtimes/${id}`);
  }

  createShowtime(showtime: Partial<Showtime>): Observable<Showtime> {
    return this.http.post<Showtime>(`${environment.apiUrl}/showtimes`, showtime);
  }

  updateShowtime(id: string, showtime: Partial<Showtime>): Observable<Showtime> {
    return this.http.put<Showtime>(`${environment.apiUrl}/showtimes/${id}`, showtime);
  }

  deleteShowtime(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/showtimes/${id}`);
  }
}

