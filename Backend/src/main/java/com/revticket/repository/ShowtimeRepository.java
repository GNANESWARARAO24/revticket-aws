package com.revticket.repository;

import com.revticket.entity.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ShowtimeRepository extends JpaRepository<Showtime, String> {
    List<Showtime> findByMovieId(String movieId);
    
    @Query("SELECT s FROM Showtime s WHERE s.movie.id = :movieId AND DATE(s.showDateTime) = :date")
    List<Showtime> findByMovieIdAndDate(@Param("movieId") String movieId, @Param("date") LocalDate date);
    
    List<Showtime> findByShowDateTimeAfter(LocalDateTime dateTime);
}

