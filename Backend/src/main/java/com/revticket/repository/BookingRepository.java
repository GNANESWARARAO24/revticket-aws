package com.revticket.repository;

import com.revticket.entity.Booking;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
    
    @EntityGraph(attributePaths = {"showtime", "showtime.movie", "showtime.theater", "user"})
    List<Booking> findByUserId(String userId);
    
    @EntityGraph(attributePaths = {"showtime", "showtime.movie", "showtime.theater", "user"})
    List<Booking> findByShowtimeId(String showtimeId);
    
    @EntityGraph(attributePaths = {"showtime", "showtime.movie", "showtime.theater", "user"})
    @Query("SELECT b FROM Booking b")
    @NonNull
    List<Booking> findAll();
    
    @EntityGraph(attributePaths = {"showtime", "showtime.movie", "showtime.theater", "user"})
    @NonNull
    Optional<Booking> findById(@NonNull String id);
}

