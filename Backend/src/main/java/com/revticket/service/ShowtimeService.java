package com.revticket.service;

import com.revticket.entity.Showtime;
import com.revticket.repository.ShowtimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ShowtimeService {

    @Autowired
    private ShowtimeRepository showtimeRepository;

    public List<Showtime> getShowtimesByMovie(String movieId) {
        return showtimeRepository.findByMovieId(movieId);
    }

    public List<Showtime> getShowtimesByMovieAndDate(String movieId, LocalDate date) {
        return showtimeRepository.findByMovieIdAndDate(movieId, date);
    }

    public Optional<Showtime> getShowtimeById(String id) {
        return showtimeRepository.findById(id);
    }

    public Showtime createShowtime(Showtime showtime) {
        return showtimeRepository.save(showtime);
    }

    public Showtime updateShowtime(String id, Showtime showtimeDetails) {
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Showtime not found"));
        
        showtime.setShowDateTime(showtimeDetails.getShowDateTime());
        showtime.setTicketPrice(showtimeDetails.getTicketPrice());
        showtime.setTotalSeats(showtimeDetails.getTotalSeats());
        showtime.setAvailableSeats(showtimeDetails.getAvailableSeats());
        showtime.setStatus(showtimeDetails.getStatus());

        return showtimeRepository.save(showtime);
    }

    public void deleteShowtime(String id) {
        showtimeRepository.deleteById(id);
    }
}

