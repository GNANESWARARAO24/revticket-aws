-- Sample screens data for existing theaters
-- Run this after theaters are created

-- Insert screens for each theater (assuming theaters exist)
-- You can adjust theater IDs based on your actual data

-- Example: Insert screens for a theater
-- Replace 'THEATER_ID_HERE' with actual theater IDs from your database

-- Screen 1 - Large capacity
INSERT INTO screens (id, name, total_seats, theater_id, is_active)
SELECT UUID(), 'Screen 1', 200, id, TRUE FROM theaters WHERE is_active = TRUE LIMIT 1;

-- Screen 2 - Medium capacity
INSERT INTO screens (id, name, total_seats, theater_id, is_active)
SELECT UUID(), 'Screen 2', 150, id, TRUE FROM theaters WHERE is_active = TRUE LIMIT 1;

-- Screen 3 - Medium capacity
INSERT INTO screens (id, name, total_seats, theater_id, is_active)
SELECT UUID(), 'Screen 3', 180, id, TRUE FROM theaters WHERE is_active = TRUE LIMIT 1;

-- Screen 4 - Small capacity
INSERT INTO screens (id, name, total_seats, theater_id, is_active)
SELECT UUID(), 'Screen 4', 120, id, TRUE FROM theaters WHERE is_active = TRUE LIMIT 1;

-- For multiple theaters, you can use this pattern:
-- INSERT INTO screens (id, name, total_seats, theater_id, is_active)
-- SELECT 
--     UUID() as id,
--     CONCAT('Screen ', n.n) as name,
--     CASE 
--         WHEN n.n = 1 THEN 200
--         WHEN n.n = 2 THEN 150
--         WHEN n.n = 3 THEN 180
--         ELSE 120
--     END as total_seats,
--     t.id as theater_id,
--     TRUE as is_active
-- FROM theaters t
-- CROSS JOIN (
--     SELECT 1 as n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
-- ) n
-- WHERE t.total_screens >= n.n AND t.is_active = TRUE;
