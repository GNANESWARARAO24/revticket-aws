package com.revticket.service;

import com.revticket.dto.ScreenResponse;
import com.revticket.entity.Screen;
import com.revticket.entity.Theater;
import com.revticket.repository.ScreenRepository;
import com.revticket.repository.TheaterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScreenService {

    @Autowired
    private ScreenRepository screenRepository;

    @Autowired
    private TheaterRepository theaterRepository;

    @Transactional(readOnly = true)
    public List<ScreenResponse> getScreensByTheater(String theaterId, boolean activeOnly) {
        List<Screen> screens = activeOnly
                ? screenRepository.findByTheaterIdAndIsActive(theaterId, true)
                : screenRepository.findByTheaterId(theaterId);
        
        return screens.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ScreenResponse createScreen(String theaterId, String name, Integer totalSeats) {
        Theater theater = theaterRepository.findById(theaterId)
                .orElseThrow(() -> new RuntimeException("Theater not found"));

        Screen screen = new Screen();
        screen.setName(name);
        screen.setTotalSeats(totalSeats);
        screen.setTheater(theater);
        screen.setIsActive(true);

        Screen saved = screenRepository.save(screen);
        return mapToResponse(saved);
    }

    private ScreenResponse mapToResponse(Screen screen) {
        return ScreenResponse.builder()
                .id(screen.getId())
                .name(screen.getName())
                .totalSeats(screen.getTotalSeats())
                .theaterId(screen.getTheater().getId())
                .isActive(screen.getIsActive())
                .build();
    }
}
