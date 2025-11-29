-- Quick Setup Script for Manage Shows Feature
-- Run this after your main schema is created

USE revticket_db;

-- Step 1: Ensure screens table exists (should be in schema.sql)
CREATE TABLE IF NOT EXISTS screens (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    total_seats INT NOT NULL,
    theater_id VARCHAR(36) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (theater_id) REFERENCES theaters(id) ON DELETE CASCADE
);

-- Step 2: Add indexes if not exists
CREATE INDEX IF NOT EXISTS idx_screens_theater ON screens(theater_id);
CREATE INDEX IF NOT EXISTS idx_screens_active ON screens(is_active);
CREATE INDEX IF NOT EXISTS idx_showtime_screen ON showtimes(screen);

-- Step 3: Sample data - Add screens for existing theaters
-- This will create 4 screens for each active theater
INSERT INTO screens (id, name, total_seats, theater_id, is_active)
SELECT 
    UUID() as id,
    CONCAT('Screen ', n.n) as name,
    CASE 
        WHEN n.n = 1 THEN 200
        WHEN n.n = 2 THEN 150
        WHEN n.n = 3 THEN 180
        WHEN n.n = 4 THEN 120
        ELSE 100
    END as total_seats,
    t.id as theater_id,
    TRUE as is_active
FROM theaters t
CROSS JOIN (
    SELECT 1 as n UNION ALL 
    SELECT 2 UNION ALL 
    SELECT 3 UNION ALL 
    SELECT 4
) n
WHERE t.is_active = TRUE
  AND NOT EXISTS (
    SELECT 1 FROM screens s 
    WHERE s.theater_id = t.id 
    AND s.name = CONCAT('Screen ', n.n)
  );

-- Step 4: Verify setup
SELECT 
    t.name as theater_name,
    COUNT(s.id) as total_screens,
    SUM(s.total_seats) as total_capacity
FROM theaters t
LEFT JOIN screens s ON t.id = s.theater_id
WHERE t.is_active = TRUE
GROUP BY t.id, t.name
ORDER BY t.name;

-- Expected output: Each theater should have 4 screens with total capacity of 650 seats
