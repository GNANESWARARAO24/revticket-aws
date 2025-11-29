import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentRequest } from '../models/booking.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);

  processPayment(paymentData: PaymentRequest): Observable<{ success: boolean; transactionId: string }> {
    return this.http.post<{ success: boolean; transactionId: string }>(`${environment.apiUrl}/payments`, paymentData);
  }

  getPaymentStatus(transactionId: string): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(`${environment.apiUrl}/payments/${transactionId}/status`);
  }
}