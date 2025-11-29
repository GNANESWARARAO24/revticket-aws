-- ============================================
-- Sample Movie Data for Testing
-- ============================================

USE revticket_db;

-- Insert sample movies (using UUID format)
INSERT INTO movies (id, title, description, duration, rating, release_date, poster_url, trailer_url, language, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'The Dark Knight', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.', 152, 'U/A', '2008-07-18', 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', 'https://www.youtube.com/watch?v=EXeTwQWrcwY', 'English', TRUE),
('550e8400-e29b-41d4-a716-446655440002', 'Inception', 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.', 148, 'U/A', '2010-07-16', 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', 'https://www.youtube.com/watch?v=YoHD9XEInc0', 'English', TRUE),
('550e8400-e29b-41d4-a716-446655440003', 'Interstellar', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity survival.', 169, 'U', '2014-11-07', 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', 'https://www.youtube.com/watch?v=zSWdZVtXT7E', 'English', TRUE),
('550e8400-e29b-41d4-a716-446655440004', 'The Shawshank Redemption', 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', 142, 'A', '1994-09-23', 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', 'https://www.youtube.com/watch?v=6hB3S9bIaco', 'English', TRUE),
('550e8400-e29b-41d4-a716-446655440005', 'Pulp Fiction', 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.', 154, 'A', '1994-10-14', 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', 'https://www.youtube.com/watch?v=s7EdQ4FqbhY', 'English', TRUE);

-- Insert genres for movies
INSERT INTO movie_genres (movie_id, genre) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Action'),
('550e8400-e29b-41d4-a716-446655440001', 'Crime'),
('550e8400-e29b-41d4-a716-446655440001', 'Drama'),
('550e8400-e29b-41d4-a716-446655440002', 'Action'),
('550e8400-e29b-41d4-a716-446655440002', 'Sci-Fi'),
('550e8400-e29b-41d4-a716-446655440002', 'Thriller'),
('550e8400-e29b-41d4-a716-446655440003', 'Adventure'),
('550e8400-e29b-41d4-a716-446655440003', 'Drama'),
('550e8400-e29b-41d4-a716-446655440003', 'Sci-Fi'),
('550e8400-e29b-41d4-a716-446655440004', 'Drama'),
('550e8400-e29b-41d4-a716-446655440005', 'Crime'),
('550e8400-e29b-41d4-a716-446655440005', 'Drama');

-- Verify data
SELECT 'Sample movies inserted:' as info;
SELECT m.id, m.title, m.duration, m.rating, m.is_active, 
       GROUP_CONCAT(mg.genre) as genres
FROM movies m
LEFT JOIN movie_genres mg ON m.id = mg.movie_id
GROUP BY m.id, m.title, m.duration, m.rating, m.is_active;
