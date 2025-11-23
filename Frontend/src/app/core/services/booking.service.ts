import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, BookingRequest, PaymentRequest } from '../models/booking.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  constructor(private http: HttpClient) {}

  createBooking(bookingData: BookingRequest): Observable<Booking> {
    return this.http.post<Booking>(`${environment.apiUrl}/bookings`, bookingData);
  }

  getUserBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${environment.apiUrl}/bookings/my-bookings`);
  }

  getBookingById(id: string): Observable<Booking> {
    return this.http.get<Booking>(`${environment.apiUrl}/bookings/${id}`);
  }

  cancelBooking(id: string, reason?: string): Observable<{ refundAmount: number }> {
    return this.http.post<{ refundAmount: number }>(
      `${environment.apiUrl}/bookings/${id}/cancel`,
      reason ? { reason } : {}
    );
  }

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${environment.apiUrl}/bookings/all`);
  }

  private currentBookingData: any = null;

  setCurrentBooking(data: any): void {
    this.currentBookingData = data;
  }

  getCurrentBooking(): any {
    return this.currentBookingData;
  }
}
