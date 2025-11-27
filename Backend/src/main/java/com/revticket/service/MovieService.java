package com.revticket.service;

import com.revticket.entity.Movie;
import com.revticket.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    public List<Movie> getAllMovies() {
        return movieRepository.findByIsActiveTrue();
    }

    public Optional<Movie> getMovieById(String id) {
        return movieRepository.findById(Objects.requireNonNullElse(id, ""));
    }

    public Movie createMovie(Movie movie) {
        return movieRepository.save(movie);
    }

    public Movie updateMovie(String id, Movie movieDetails) {
        Movie movie = movieRepository.findById(Objects.requireNonNullElse(id, ""))
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        
        movie.setTitle(movieDetails.getTitle());
        movie.setDescription(movieDetails.getDescription());
        movie.setGenre(movieDetails.getGenre());
        movie.setDuration(movieDetails.getDuration());
        movie.setRating(movieDetails.getRating());
        movie.setReleaseDate(movieDetails.getReleaseDate());
        movie.setPosterUrl(movieDetails.getPosterUrl());
        movie.setTrailerUrl(movieDetails.getTrailerUrl());
        movie.setLanguage(movieDetails.getLanguage());
        movie.setIsActive(movieDetails.getIsActive());

        return movieRepository.save(movie);
    }

    public void deleteMovie(String id) {
        Movie movie = movieRepository.findById(Objects.requireNonNullElse(id, ""))
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        movie.setIsActive(false);
        movieRepository.save(movie);
    }
}

