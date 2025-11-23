import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SeatLayout, SeatAvailability, Seat, SeatType } from '../models/seat.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SeatService {
  constructor(private http: HttpClient) {}

  getSeatLayout(showtimeId: string): Observable<SeatLayout> {
    return this.http.get<Seat[]>(`${environment.apiUrl}/seats/showtime/${showtimeId}`).pipe(
      map(seats => {
        if (!seats || seats.length === 0) {
          // If no seats exist, initialize them
          this.initializeSeatsForShowtime(showtimeId).subscribe();
          return this.createEmptyLayout(showtimeId);
        }

        const rows = [...new Set(seats.map(s => s.row))].sort();
        const seatsPerRow = Math.max(...seats.map(s => s.number));
        
        return {
          showtimeId,
          theater: 'Theater', // Will be populated from showtime
          screen: 'Screen 1', // Will be populated from showtime
          totalSeats: seats.length,
          availableSeats: seats.filter(s => !s.isBooked).length,
          seats: seats.map(s => ({
            id: s.id,
            row: s.row,
            number: s.number,
            isBooked: s.isBooked,
            isHeld: s.isHeld,
            price: s.price,
            type: s.type as SeatType
          })),
          rows,
          seatsPerRow
        };
      })
    );
  }

  private createEmptyLayout(showtimeId: string): SeatLayout {
    return {
      showtimeId,
      theater: 'Theater',
      screen: 'Screen 1',
      totalSeats: 0,
      availableSeats: 0,
      seats: [],
      rows: [],
      seatsPerRow: 0
    };
  }

  holdSeats(showtimeId: string, seatIds: string[]): Observable<void> {
    const sessionId = `session_${Date.now()}`;
    return this.http.post<void>(`${environment.apiUrl}/seats/hold`, {
      showtimeId,
      seatIds,
      sessionId
    });
  }

  releaseSeats(showtimeId: string, seatIds: string[]): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/seats/release`, {
      showtimeId,
      seatIds
    });
  }

  getRealTimeAvailability(showtimeId: string): Observable<SeatAvailability[]> {
    return this.http.get<Seat[]>(`${environment.apiUrl}/seats/showtime/${showtimeId}`).pipe(
      map(seats => seats.map(seat => ({
        seatId: seat.id,
        isAvailable: !seat.isBooked,
        isHeld: seat.isHeld,
        heldBy: seat.isHeld ? 'session' : undefined,
        holdExpiry: seat.isHeld ? new Date(Date.now() + 10 * 60 * 1000) : undefined
      })))
    );
  }

  extendSeatHold(showtimeId: string, seatIds: string[]): Observable<void> {
    // Re-hold seats to extend expiry
    return this.holdSeats(showtimeId, seatIds);
  }

  initializeSeatsForShowtime(showtimeId: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/seats/showtime/${showtimeId}/initialize`, {});
  }
}
