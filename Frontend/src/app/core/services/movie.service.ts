import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie, Showtime } from '../models/movie.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  constructor(private http: HttpClient) {}

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${environment.apiUrl}/movies`);
  }

  getMovieById(id: string): Observable<Movie> {
    return this.http.get<Movie>(`${environment.apiUrl}/movies/${id}`);
  }

  getShowtimes(movieId: string, date?: string): Observable<Showtime[]> {
    const url = date 
      ? `${environment.apiUrl}/showtimes/movie/${movieId}?date=${date}`
      : `${environment.apiUrl}/showtimes/movie/${movieId}`;
    return this.http.get<Showtime[]>(url);
  }

  addMovie(movie: Partial<Movie>): Observable<Movie> {
    return this.http.post<Movie>(`${environment.apiUrl}/movies`, movie);
  }

  updateMovie(id: string, movie: Partial<Movie>): Observable<Movie> {
    return this.http.put<Movie>(`${environment.apiUrl}/movies/${id}`, movie);
  }

  deleteMovie(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/movies/${id}`);
  }
}