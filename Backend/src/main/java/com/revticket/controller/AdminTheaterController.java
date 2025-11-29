package com.revticket.controller;

import com.revticket.dto.ScreenResponse;
import com.revticket.dto.TheaterResponse;
import com.revticket.entity.Screen;
import com.revticket.repository.ScreenRepository;
import com.revticket.service.TheaterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/theaters")
@CrossOrigin(origins = {"http://localhost:4200", "*"})
@PreAuthorize("hasRole('ADMIN')")
public class AdminTheaterController {

    @Autowired
    private TheaterService theaterService;

    @Autowired
    private ScreenRepository screenRepository;

    @GetMapping
    public ResponseEntity<List<TheaterResponse>> getAllTheaters(
            @RequestParam(name = "activeOnly", required = false, defaultValue = "false") Boolean activeOnly) {
        return ResponseEntity.ok(theaterService.getAllTheaters(activeOnly));
    }

    @GetMapping("/{id}/screens")
    public ResponseEntity<List<ScreenResponse>> getTheaterScreens(@PathVariable String id) {
        List<Screen> screens = screenRepository.findByTheaterIdAndIsActive(id, true);
        List<ScreenResponse> response = screens.stream()
                .map(screen -> ScreenResponse.builder()
                        .id(screen.getId())
                        .name(screen.getName())
                        .totalSeats(screen.getTotalSeats())
                        .theaterId(screen.getTheater().getId())
                        .isActive(screen.getIsActive())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
}
