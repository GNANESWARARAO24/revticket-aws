-- ============================================
-- Verify Admin User Setup
-- ============================================
-- Run this to check if your admin user is set up correctly
-- ============================================

USE revticket_db;

-- Check 1: Verify admin user exists
SELECT 
    'Admin User Check' AS check_type,
    CASE 
        WHEN COUNT(*) > 0 THEN '✓ Admin user exists'
        ELSE '✗ Admin user does NOT exist'
    END AS status
FROM users 
WHERE email = 'admin@revticket.com';

-- Check 2: Verify role is correct
SELECT 
    'Role Check' AS check_type,
    email,
    name,
    role,
    CASE 
        WHEN UPPER(role) = 'ADMIN' THEN '✓ Role is ADMIN'
        WHEN LOWER(role) = 'admin' THEN '⚠ Role is lowercase (will be normalized)'
        ELSE '✗ Role is incorrect'
    END AS role_status
FROM users 
WHERE email = 'admin@revticket.com';

-- Check 3: Verify password hash format (should start with $2a$)
SELECT 
    'Password Hash Check' AS check_type,
    email,
    CASE 
        WHEN password LIKE '$2a$%' THEN '✓ Password is BCrypt encoded'
        WHEN password LIKE '$2b$%' THEN '✓ Password is BCrypt encoded (variant)'
        ELSE '✗ Password is NOT BCrypt encoded'
    END AS password_status,
    LEFT(password, 20) AS password_preview
FROM users 
WHERE email = 'admin@revticket.com';

-- Check 4: Show full admin user details
SELECT 
    'Admin User Details' AS info,
    id,
    email,
    name,
    role,
    LENGTH(password) AS password_length,
    LEFT(password, 30) AS password_hash_preview,
    created_at
FROM users 
WHERE email = 'admin@revticket.com';

-- ============================================
-- If role is lowercase, update it:
-- ============================================
-- UPDATE users SET role = 'ADMIN' WHERE email = 'admin@revticket.com';
-- ============================================

