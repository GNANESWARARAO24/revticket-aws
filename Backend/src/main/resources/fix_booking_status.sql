-- Fix for booking status column to support CANCELLATION_REQUESTED
-- Run this SQL script on your database to fix the existing schema

USE revticket_db;

ALTER TABLE bookings 
MODIFY COLUMN status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'CANCELLATION_REQUESTED') DEFAULT 'PENDING';
