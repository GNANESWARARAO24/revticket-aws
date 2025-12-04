-- Add is_disabled column to seats table
ALTER TABLE seats ADD COLUMN is_disabled BOOLEAN NOT NULL DEFAULT FALSE;

-- Update existing seats to set is_disabled = false
UPDATE seats SET is_disabled = FALSE WHERE is_disabled IS NULL;

-- Add index for better performance on seat queries
CREATE INDEX idx_seats_disabled ON seats(is_disabled);
CREATE INDEX idx_seats_showtime_status ON seats(showtime_id, is_booked, is_held, is_disabled);