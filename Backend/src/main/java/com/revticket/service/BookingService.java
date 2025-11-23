package com.revticket.service;

import com.revticket.dto.BookingRequest;
import com.revticket.entity.Booking;
import com.revticket.entity.Seat;
import com.revticket.entity.Showtime;
import com.revticket.entity.User;
import com.revticket.repository.BookingRepository;
import com.revticket.repository.SeatRepository;
import com.revticket.repository.ShowtimeRepository;
import com.revticket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ShowtimeRepository showtimeRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Transactional
    public Booking createBooking(String userId, BookingRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Showtime showtime = showtimeRepository.findById(request.getShowtimeId())
                .orElseThrow(() -> new RuntimeException("Showtime not found"));

        // Check seat availability
        for (String seatId : request.getSeats()) {
            Seat seat = seatRepository.findById(seatId)
                    .orElseThrow(() -> new RuntimeException("Seat not found: " + seatId));
            
            if (seat.getIsBooked()) {
                throw new RuntimeException("Seat " + seatId + " is already booked");
            }
        }

        // Create booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setShowtime(showtime);
        booking.setSeats(request.getSeats());
        booking.setTotalAmount(request.getTotalAmount());
        booking.setCustomerName(request.getCustomerName());
        booking.setCustomerEmail(request.getCustomerEmail());
        booking.setCustomerPhone(request.getCustomerPhone());
        booking.setStatus(Booking.BookingStatus.PENDING);
        booking.setTicketNumber("TKT" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        booking.setQrCode("QR_" + UUID.randomUUID().toString());

        booking = bookingRepository.save(booking);

        // Mark seats as booked
        for (String seatId : request.getSeats()) {
            Seat seat = seatRepository.findById(seatId).orElse(null);
            if (seat != null) {
                seat.setIsBooked(true);
                seatRepository.save(seat);
            }
        }

        // Update available seats
        showtime.setAvailableSeats(showtime.getAvailableSeats() - request.getSeats().size());
        showtimeRepository.save(showtime);

        return booking;
    }

    public List<Booking> getUserBookings(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    public Optional<Booking> getBookingById(String id) {
        return bookingRepository.findById(id);
    }

    @Transactional
    public Booking cancelBooking(String id, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking.setCancellationReason(reason);

        // Release seats
        for (String seatId : booking.getSeats()) {
            Seat seat = seatRepository.findById(seatId).orElse(null);
            if (seat != null) {
                seat.setIsBooked(false);
                seatRepository.save(seat);
            }
        }

        // Update available seats
        Showtime showtime = booking.getShowtime();
        showtime.setAvailableSeats(showtime.getAvailableSeats() + booking.getSeats().size());
        showtimeRepository.save(showtime);

        // Calculate refund (simplified logic)
        booking.setRefundAmount(calculateRefund(booking));
        booking.setRefundDate(java.time.LocalDateTime.now());

        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    private Double calculateRefund(Booking booking) {
        // Simplified refund calculation
        // In production, implement proper refund policy
        return booking.getTotalAmount() * 0.9; // 90% refund
    }
}

