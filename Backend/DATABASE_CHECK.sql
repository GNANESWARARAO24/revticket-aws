-- ============================================
-- Database Check Script
-- ============================================
-- Run this first to check if your database needs modification
-- ============================================

USE revticket_db;

-- Check 1: Does users table exist?
SELECT 
    'Table Check' AS check_type,
    CASE 
        WHEN COUNT(*) > 0 THEN '✓ Users table exists'
        ELSE '✗ Users table does NOT exist - Run DATABASE_SETUP.sql first'
    END AS status
FROM information_schema.tables 
WHERE table_schema = 'revticket_db' 
AND table_name = 'users';

-- Check 2: Does role column exist?
SELECT 
    'Role Column Check' AS check_type,
    CASE 
        WHEN COUNT(*) > 0 THEN '✓ Role column exists'
        ELSE '✗ Role column does NOT exist'
    END AS status
FROM information_schema.columns 
WHERE table_schema = 'revticket_db' 
AND table_name = 'users' 
AND column_name = 'role';

-- Check 3: Does role column support ADMIN?
SELECT 
    'Role Enum Check' AS check_type,
    CASE 
        WHEN column_type LIKE '%ADMIN%' THEN '✓ Role column supports ADMIN'
        ELSE '✗ Role column does NOT support ADMIN - Needs modification'
    END AS status,
    column_type AS current_type
FROM information_schema.columns 
WHERE table_schema = 'revticket_db' 
AND table_name = 'users' 
AND column_name = 'role';

-- Check 4: Does admin user exist?
SELECT 
    'Admin User Check' AS check_type,
    CASE 
        WHEN COUNT(*) > 0 THEN '✓ Admin user exists'
        ELSE '✗ Admin user does NOT exist - Run CREATE_ADMIN_USER.sql'
    END AS status
FROM users 
WHERE email = 'admin@revticket.com' 
AND role = 'ADMIN';

-- Show current users table structure
SELECT 'Current Table Structure' AS info;
DESCRIBE users;

-- Show all users
SELECT 'All Users' AS info;
SELECT id, email, name, role, created_at 
FROM users 
ORDER BY created_at DESC;

