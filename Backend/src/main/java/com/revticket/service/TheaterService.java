package com.revticket.service;

import com.revticket.entity.Theater;
import com.revticket.repository.TheaterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TheaterService {

    @Autowired
    private TheaterRepository theaterRepository;

    public List<Theater> getAllTheaters() {
        return theaterRepository.findByIsActiveTrue();
    }

    public Optional<Theater> getTheaterById(String id) {
        return theaterRepository.findById(id);
    }

    public Theater createTheater(Theater theater) {
        return theaterRepository.save(theater);
    }

    public Theater updateTheater(String id, Theater theaterDetails) {
        Theater theater = theaterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Theater not found"));
        
        theater.setName(theaterDetails.getName());
        theater.setLocation(theaterDetails.getLocation());
        theater.setAddress(theaterDetails.getAddress());
        theater.setTotalScreens(theaterDetails.getTotalScreens());
        theater.setImageUrl(theaterDetails.getImageUrl());
        theater.setIsActive(theaterDetails.getIsActive());

        return theaterRepository.save(theater);
    }

    public void deleteTheater(String id) {
        Theater theater = theaterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Theater not found"));
        theater.setIsActive(false);
        theaterRepository.save(theater);
    }
}

