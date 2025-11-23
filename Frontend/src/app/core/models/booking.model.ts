export interface Booking {
  id: string;
  userId: string;
  movieId: string;
  movieTitle: string;
  theaterId: string;
  theaterName: string;
  showtimeId: string;
  showtime: Date;
  seats: string[];
  totalAmount: number;
  bookingDate: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentId?: string;
  qrCode?: string;
  ticketNumber?: string;
  refundAmount?: number;
  refundDate?: Date;
  cancellationReason?: string;
}

export interface BookingRequest {
  movieId: string;
  movieTitle?: string;
  theaterId: string;
  theaterName?: string;
  showtimeId: string;
  showtime: Date;
  seats: string[];
  totalAmount: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export interface PaymentRequest {
  bookingId: string;
  amount: number;
  paymentMethod: 'CARD' | 'UPI' | 'WALLET';
}