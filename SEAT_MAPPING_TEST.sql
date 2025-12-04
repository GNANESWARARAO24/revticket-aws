-- Test script to verify seat mapping between admin configuration and user display

-- 1. Check seat_data configuration (admin side)
SELECT 
    sd.seat_id,
    sd.label,
    sd.row_num as admin_row_index,
    sd.col as admin_col_index,
    sd.status,
    sd.category_id,
    sc.name as category_name,
    sc.price
FROM seat_data sd
LEFT JOIN seat_categories sc ON sd.category_id = sc.id
WHERE sd.screen_id = 'YOUR_SCREEN_ID'
ORDER BY sd.row_num, sd.col;

-- 2. Check generated seats (user side)
SELECT 
    s.id,
    s.row as user_row_label,
    s.number as user_seat_number,
    s.is_booked,
    s.is_held,
    s.is_disabled,
    s.price,
    s.type,
    st.id as showtime_id
FROM seats s
JOIN showtimes st ON s.showtime_id = st.id
WHERE st.screen = 'YOUR_SCREEN_ID'
ORDER BY s.row, s.number;

-- 3. Verify mapping consistency
-- This query should show if admin disabled seats (B6, C6) are properly marked as disabled in user seats
SELECT 
    CONCAT(CHAR(65 + sd.row_num), sd.col + 1) as expected_seat_label,
    sd.status as admin_status,
    s.row as actual_row,
    s.number as actual_number,
    s.is_disabled as user_disabled,
    s.is_booked as user_booked
FROM seat_data sd
LEFT JOIN seats s ON (
    s.row = CHAR(65 + sd.row_num) AND 
    s.number = sd.col + 1 AND 
    s.showtime_id = 'YOUR_SHOWTIME_ID'
)
WHERE sd.screen_id = 'YOUR_SCREEN_ID'
AND sd.status = 'disabled'
ORDER BY sd.row_num, sd.col;