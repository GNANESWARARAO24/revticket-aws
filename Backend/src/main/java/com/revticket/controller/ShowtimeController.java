package com.revticket.controller;

import com.revticket.entity.Showtime;
import com.revticket.service.ShowtimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/showtimes")
@CrossOrigin(origins = "*")
public class ShowtimeController {

    @Autowired
    private ShowtimeService showtimeService;

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<Showtime>> getShowtimesByMovie(
            @PathVariable String movieId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (date != null) {
            return ResponseEntity.ok(showtimeService.getShowtimesByMovieAndDate(movieId, date));
        }
        return ResponseEntity.ok(showtimeService.getShowtimesByMovie(movieId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Showtime> getShowtimeById(@PathVariable String id) {
        return showtimeService.getShowtimeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Showtime> createShowtime(@RequestBody Showtime showtime) {
        return ResponseEntity.ok(showtimeService.createShowtime(showtime));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Showtime> updateShowtime(@PathVariable String id, @RequestBody Showtime showtime) {
        return ResponseEntity.ok(showtimeService.updateShowtime(id, showtime));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteShowtime(@PathVariable String id) {
        showtimeService.deleteShowtime(id);
        return ResponseEntity.ok().build();
    }
}

