-- Sample Data for RevTicket Database
-- Run this after creating the database schema

-- Insert sample movies
INSERT INTO movies (id, title, description, duration, rating, release_date, poster_url, trailer_url, language, is_active) VALUES
('movie-1', 'The Dark Knight', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.', 152, 9.0, '2008-07-18', 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', 'https://www.youtube.com/watch?v=EXeTwQWrcwY', 'English', true),
('movie-2', 'Inception', 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.', 148, 8.8, '2010-07-16', 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', 'https://www.youtube.com/watch?v=YoHD9XEInc0', 'English', true),
('movie-3', 'Interstellar', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity survival.', 169, 8.6, '2014-11-07', 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', 'https://www.youtube.com/watch?v=zSWdZVtXT7E', 'English', true),
('movie-4', 'The Shawshank Redemption', 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', 142, 9.3, '1994-09-23', 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', 'https://www.youtube.com/watch?v=6hB3S9bIaco', 'English', true),
('movie-5', 'Pulp Fiction', 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.', 154, 8.9, '1994-10-14', 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', 'https://www.youtube.com/watch?v=s7EdQ4FqbhY', 'English', true);

-- Insert movie genres
INSERT INTO movie_genres (movie_id, genre) VALUES
('movie-1', 'Action'),
('movie-1', 'Crime'),
('movie-1', 'Drama'),
('movie-2', 'Action'),
('movie-2', 'Sci-Fi'),
('movie-2', 'Thriller'),
('movie-3', 'Adventure'),
('movie-3', 'Drama'),
('movie-3', 'Sci-Fi'),
('movie-4', 'Drama'),
('movie-5', 'Crime'),
('movie-5', 'Drama');

-- Insert sample theaters
INSERT INTO theaters (id, name, location, address, total_screens, image_url, is_active) VALUES
('theater-1', 'PVR Cinemas', 'Downtown', '123 Main Street, Downtown, City', 8, 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba', true),
('theater-2', 'INOX Multiplex', 'Mall Road', '456 Mall Road, Shopping District, City', 6, 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c', true),
('theater-3', 'Cinepolis', 'Westside', '789 West Avenue, Westside, City', 10, 'https://images.unsplash.com/photo-1478720568477-152d9b164e26', true);

-- Insert sample showtimes (for next 3 days)
INSERT INTO showtimes (id, movie_id, theater_id, screen, show_date_time, ticket_price, total_seats, available_seats, status) VALUES
-- Today's shows
('show-1', 'movie-1', 'theater-1', 'Screen 1', DATE_ADD(CURDATE(), INTERVAL 10 HOUR), 250.00, 100, 100, 'ACTIVE'),
('show-2', 'movie-1', 'theater-1', 'Screen 1', DATE_ADD(CURDATE(), INTERVAL 14 HOUR), 300.00, 100, 100, 'ACTIVE'),
('show-3', 'movie-1', 'theater-1', 'Screen 1', DATE_ADD(CURDATE(), INTERVAL 18 HOUR), 350.00, 100, 100, 'ACTIVE'),
('show-4', 'movie-2', 'theater-1', 'Screen 2', DATE_ADD(CURDATE(), INTERVAL 11 HOUR), 250.00, 100, 100, 'ACTIVE'),
('show-5', 'movie-2', 'theater-1', 'Screen 2', DATE_ADD(CURDATE(), INTERVAL 15 HOUR), 300.00, 100, 100, 'ACTIVE'),
('show-6', 'movie-3', 'theater-2', 'Screen 1', DATE_ADD(CURDATE(), INTERVAL 12 HOUR), 280.00, 120, 120, 'ACTIVE'),
('show-7', 'movie-3', 'theater-2', 'Screen 1', DATE_ADD(CURDATE(), INTERVAL 16 HOUR), 320.00, 120, 120, 'ACTIVE'),
('show-8', 'movie-4', 'theater-2', 'Screen 2', DATE_ADD(CURDATE(), INTERVAL 13 HOUR), 250.00, 100, 100, 'ACTIVE'),
('show-9', 'movie-5', 'theater-3', 'Screen 1', DATE_ADD(CURDATE(), INTERVAL 14 HOUR), 300.00, 150, 150, 'ACTIVE'),
('show-10', 'movie-5', 'theater-3', 'Screen 1', DATE_ADD(CURDATE(), INTERVAL 19 HOUR), 350.00, 150, 150, 'ACTIVE'),

-- Tomorrow's shows
('show-11', 'movie-1', 'theater-1', 'Screen 1', DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 10 HOUR, 250.00, 100, 100, 'ACTIVE'),
('show-12', 'movie-2', 'theater-1', 'Screen 2', DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 14 HOUR, 300.00, 100, 100, 'ACTIVE'),
('show-13', 'movie-3', 'theater-2', 'Screen 1', DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 12 HOUR, 280.00, 120, 120, 'ACTIVE'),
('show-14', 'movie-4', 'theater-2', 'Screen 2', DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 16 HOUR, 250.00, 100, 100, 'ACTIVE'),
('show-15', 'movie-5', 'theater-3', 'Screen 1', DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 18 HOUR, 350.00, 150, 150, 'ACTIVE');

-- Note: Seats will be auto-generated when showtimes are accessed
-- Users need to be created via signup endpoint
-- Admin user should be created using CREATE_ADMIN_USER.sql

SELECT 'Sample data inserted successfully!' as message;
SELECT COUNT(*) as total_movies FROM movies;
SELECT COUNT(*) as total_theaters FROM theaters;
SELECT COUNT(*) as total_showtimes FROM showtimes;
