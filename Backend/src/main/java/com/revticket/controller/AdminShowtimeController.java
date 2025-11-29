package com.revticket.controller;

import com.revticket.dto.ShowtimeRequest;
import com.revticket.dto.ShowtimeResponse;
import com.revticket.service.ShowtimeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/showtimes")
@CrossOrigin(origins = {"http://localhost:4200", "*"})
@PreAuthorize("hasRole('ADMIN')")
public class AdminShowtimeController {

    @Autowired
    private ShowtimeService showtimeService;

    @GetMapping
    public ResponseEntity<List<ShowtimeResponse>> getShowtimes(
            @RequestParam(name = "movieId", required = false) String movieId,
            @RequestParam(name = "theaterId", required = false) String theaterId,
            @RequestParam(name = "date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (movieId != null && date != null) {
            return ResponseEntity.ok(showtimeService.getShowtimesByMovieAndDate(movieId, date));
        }
        if (movieId != null) {
            return ResponseEntity.ok(showtimeService.getShowtimesByMovie(movieId));
        }
        if (theaterId != null) {
            return ResponseEntity.ok(showtimeService.getShowtimesByTheater(theaterId));
        }
        return ResponseEntity.ok(showtimeService.getAllShowtimes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShowtimeResponse> getShowtimeById(@PathVariable String id) {
        return showtimeService.getShowtimeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ShowtimeResponse> createShowtime(@Valid @RequestBody ShowtimeRequest request) {
        return ResponseEntity.ok(showtimeService.createShowtime(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShowtimeResponse> updateShowtime(
            @PathVariable String id,
            @Valid @RequestBody ShowtimeRequest request) {
        return ResponseEntity.ok(showtimeService.updateShowtime(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShowtime(@PathVariable String id) {
        showtimeService.deleteShowtime(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/check-conflict")
    public ResponseEntity<Map<String, Boolean>> checkConflict(
            @RequestParam String screenId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime showDateTime,
            @RequestParam(required = false) String excludeShowId) {
        boolean conflict = showtimeService.checkShowtimeConflict(screenId, showDateTime, excludeShowId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("conflict", conflict);
        return ResponseEntity.ok(response);
    }
}
