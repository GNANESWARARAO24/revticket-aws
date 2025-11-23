package com.revticket.service;

import com.revticket.entity.Seat;
import com.revticket.entity.Showtime;
import com.revticket.repository.SeatRepository;
import com.revticket.repository.ShowtimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class SeatService {

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private ShowtimeRepository showtimeRepository;

    public List<Seat> getSeatsByShowtime(String showtimeId) {
        return seatRepository.findByShowtimeId(showtimeId);
    }

    public void initializeSeatsForShowtime(String showtimeId) {
        Showtime showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new RuntimeException("Showtime not found"));

        // Create seat layout (8 rows, 12 seats per row)
        String[] rows = {"A", "B", "C", "D", "E", "F", "G", "H"};
        
        for (String row : rows) {
            for (int i = 1; i <= 12; i++) {
                Seat seat = new Seat();
                seat.setShowtime(showtime);
                seat.setRow(row);
                seat.setNumber(i);
                seat.setIsBooked(false);
                seat.setIsHeld(false);
                
                // Set price based on row
                if (row.equals("A") || row.equals("B")) {
                    seat.setPrice(150.0);
                    seat.setType(Seat.SeatType.REGULAR);
                } else if (row.equals("C") || row.equals("D") || row.equals("E")) {
                    seat.setPrice(200.0);
                    seat.setType(Seat.SeatType.PREMIUM);
                } else {
                    seat.setPrice(300.0);
                    seat.setType(Seat.SeatType.VIP);
                }
                
                seatRepository.save(seat);
            }
        }
    }

    public void holdSeats(String showtimeId, List<String> seatIds, String sessionId) {
        for (String seatId : seatIds) {
            Seat seat = seatRepository.findById(seatId)
                    .orElseThrow(() -> new RuntimeException("Seat not found: " + seatId));
            
            if (seat.getIsBooked()) {
                throw new RuntimeException("Seat " + seatId + " is already booked");
            }
            
            seat.setIsHeld(true);
            seat.setHoldExpiry(LocalDateTime.now().plusMinutes(10)); // 10 minute hold
            seat.setSessionId(sessionId);
            seatRepository.save(seat);
        }
    }

    public void releaseSeats(String showtimeId, List<String> seatIds) {
        for (String seatId : seatIds) {
            Seat seat = seatRepository.findById(seatId).orElse(null);
            if (seat != null && !seat.getIsBooked()) {
                seat.setIsHeld(false);
                seat.setHoldExpiry(null);
                seat.setSessionId(null);
                seatRepository.save(seat);
            }
        }
    }
}

