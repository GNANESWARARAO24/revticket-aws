-- Migration script to add new profile fields to users table
-- Run this if you have existing data in the database

USE revticket_db;

-- Add new columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS gender VARCHAR(20),
ADD COLUMN IF NOT EXISTS address VARCHAR(500),
ADD COLUMN IF NOT EXISTS preferred_language VARCHAR(50) DEFAULT 'english',
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS sms_notifications BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS push_notifications BOOLEAN DEFAULT TRUE;

-- Verify the changes
DESCRIBE users;

-- Optional: Set default values for existing users
UPDATE users 
SET preferred_language = 'english',
    email_notifications = TRUE,
    sms_notifications = FALSE,
    push_notifications = TRUE
WHERE preferred_language IS NULL;
