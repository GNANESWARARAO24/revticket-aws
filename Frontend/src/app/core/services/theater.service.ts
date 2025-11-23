import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Theater {
  id: string;
  name: string;
  location: string;
  address: string;
  totalScreens?: number;
  imageUrl?: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TheaterService {
  constructor(private http: HttpClient) {}

  getAllTheaters(): Observable<Theater[]> {
    return this.http.get<Theater[]>(`${environment.apiUrl}/theaters`);
  }

  getTheaterById(id: string): Observable<Theater> {
    return this.http.get<Theater>(`${environment.apiUrl}/theaters/${id}`);
  }

  createTheater(theater: Partial<Theater>): Observable<Theater> {
    return this.http.post<Theater>(`${environment.apiUrl}/theaters`, theater);
  }

  updateTheater(id: string, theater: Partial<Theater>): Observable<Theater> {
    return this.http.put<Theater>(`${environment.apiUrl}/theaters/${id}`, theater);
  }

  deleteTheater(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/theaters/${id}`);
  }
}

