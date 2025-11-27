-- Database Schema for RevTicket
-- This file is optional as Hibernate will auto-create tables
-- But can be used for manual database setup

CREATE DATABASE IF NOT EXISTS revticket_db;
USE revticket_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN') NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Movies table
CREATE TABLE IF NOT EXISTS movies (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INT NOT NULL,
    rating DOUBLE,
    release_date DATE NOT NULL,
    poster_url VARCHAR(500),
    trailer_url VARCHAR(500),
    language VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE
);

-- Movie genres (many-to-many relationship)
CREATE TABLE IF NOT EXISTS movie_genres (
    movie_id VARCHAR(36),
    genre VARCHAR(100),
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, genre)
);

-- Theaters table
CREATE TABLE IF NOT EXISTS theaters (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    total_screens INT,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE
);

-- Showtimes table
CREATE TABLE IF NOT EXISTS showtimes (
    id VARCHAR(36) PRIMARY KEY,
    movie_id VARCHAR(36) NOT NULL,
    theater_id VARCHAR(36) NOT NULL,
    screen VARCHAR(50) NOT NULL,
    show_date_time DATETIME NOT NULL,
    ticket_price DOUBLE NOT NULL,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL,
    status ENUM('ACTIVE', 'COMPLETED', 'CANCELLED') DEFAULT 'ACTIVE',
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (theater_id) REFERENCES theaters(id) ON DELETE CASCADE
);

-- Seats table
CREATE TABLE IF NOT EXISTS seats (
    id VARCHAR(36) PRIMARY KEY,
    showtime_id VARCHAR(36) NOT NULL,
    row VARCHAR(10) NOT NULL,
    number INT NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE,
    is_held BOOLEAN DEFAULT FALSE,
    price DOUBLE NOT NULL,
    type ENUM('REGULAR', 'PREMIUM', 'VIP') NOT NULL,
    hold_expiry DATETIME,
    session_id VARCHAR(255),
    FOREIGN KEY (showtime_id) REFERENCES showtimes(id) ON DELETE CASCADE
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    showtime_id VARCHAR(36) NOT NULL,
    total_amount DOUBLE NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED') DEFAULT 'PENDING',
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    payment_id VARCHAR(36),
    qr_code VARCHAR(255),
    ticket_number VARCHAR(50),
    refund_amount DOUBLE,
    refund_date DATETIME,
    cancellation_reason TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (showtime_id) REFERENCES showtimes(id) ON DELETE CASCADE
);

-- Booking seats (many-to-many relationship)
CREATE TABLE IF NOT EXISTS booking_seats (
    booking_id VARCHAR(36),
    seat_id VARCHAR(36),
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    PRIMARY KEY (booking_id, seat_id)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(36) PRIMARY KEY,
    booking_id VARCHAR(36) UNIQUE NOT NULL,
    amount DOUBLE NOT NULL,
    payment_method ENUM('CARD', 'UPI', 'WALLET') NOT NULL,
    status ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
    transaction_id VARCHAR(255) UNIQUE,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_showtime_movie ON showtimes(movie_id);
CREATE INDEX idx_showtime_theater ON showtimes(theater_id);
CREATE INDEX idx_booking_user ON bookings(user_id);
CREATE INDEX idx_booking_showtime ON bookings(showtime_id);
CREATE INDEX idx_seat_showtime ON seats(showtime_id);
CREATE INDEX idx_payment_transaction ON payments(transaction_id);

