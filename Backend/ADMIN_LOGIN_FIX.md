# Admin Login Fix - Complete Guide

## 🔧 What Was Fixed

### Backend Changes:

1. **Improved Error Handling** (`GlobalExceptionHandler.java`)
   - ✅ Proper exception handling for authentication failures
   - ✅ Clear error messages for invalid credentials
   - ✅ Distinguishes between different error types

2. **Enhanced AuthService** (`AuthService.java`)
   - ✅ Better exception handling with try-catch
   - ✅ Case-insensitive role normalization
   - ✅ Clear error messages

3. **Improved UserDetailsService** (`UserDetailsServiceImpl.java`)
   - ✅ Case-insensitive role handling (handles both "ADMIN" and "admin")
   - ✅ Proper BCrypt password verification
   - ✅ Better user account status handling

4. **Updated AuthController** (`AuthController.java`)
   - ✅ Proper exception propagation

---

## 🚀 Quick Fix Steps

### Step 1: Verify Your Admin User

```bash
cd Backend
mysql -u root -p revticket_db < VERIFY_ADMIN_USER.sql
```

This will show you:
- ✓ If admin user exists
- ✓ If role is correct
- ✓ If password is BCrypt encoded

### Step 2: Fix Admin User (If Needed)

```bash
mysql -u root -p revticket_db < FIX_ADMIN_USER.sql
```

This will:
- Delete existing admin user
- Create new admin user with correct setup
- Verify everything is correct

### Step 3: Test Login

1. Start backend: `mvn spring-boot:run`
2. Try login with:
   - Email: `admin@revticket.com`
   - Password: `admin123`

---

## 🔍 Common Issues & Solutions

### Issue 1: "Invalid credentials" - Role is lowercase

**Problem:** Database has `role = 'admin'` (lowercase) but enum expects `'ADMIN'`

**Solution:**
```sql
USE revticket_db;
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@revticket.com';
```

**Or use the fix script:**
```bash
mysql -u root -p revticket_db < FIX_ADMIN_USER.sql
```

### Issue 2: "Invalid credentials" - Password not BCrypt

**Problem:** Password in database is plain text, not BCrypt encoded

**Solution:**
```sql
USE revticket_db;
UPDATE users 
SET password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
WHERE email = 'admin@revticket.com';
```

**Or use the fix script:**
```bash
mysql -u root -p revticket_db < FIX_ADMIN_USER.sql
```

### Issue 3: "Invalid credentials" - User doesn't exist

**Problem:** Admin user not in database

**Solution:**
```bash
mysql -u root -p revticket_db < FIX_ADMIN_USER.sql
```

### Issue 4: "Invalid credentials" - Wrong password hash

**Problem:** Password hash doesn't match "admin123"

**Solution:** Use the correct BCrypt hash:
```sql
UPDATE users 
SET password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
WHERE email = 'admin@revticket.com';
```

---

## ✅ Verification Checklist

After running the fix, verify:

1. **Admin user exists:**
   ```sql
   SELECT * FROM users WHERE email = 'admin@revticket.com';
   ```

2. **Role is ADMIN (uppercase):**
   ```sql
   SELECT email, role FROM users WHERE email = 'admin@revticket.com';
   ```
   Should show: `role = 'ADMIN'`

3. **Password is BCrypt:**
   ```sql
   SELECT email, LEFT(password, 7) AS hash_type FROM users WHERE email = 'admin@revticket.com';
   ```
   Should show: `hash_type = '$2a$10$'`

4. **Test login:**
   - Email: `admin@revticket.com`
   - Password: `admin123`
   - Should login successfully

---

## 📝 Correct Admin User Setup

```sql
USE revticket_db;

INSERT INTO users (
    id, email, name, password, role, created_at
) VALUES (
    UUID(),
    'admin@revticket.com',
    'Admin User',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',  -- admin123
    'ADMIN',  -- Must be uppercase
    NOW()
);
```

**Key Points:**
- ✅ Email: `admin@revticket.com`
- ✅ Password hash: Must start with `$2a$10$` (BCrypt)
- ✅ Role: Must be `'ADMIN'` (uppercase) - backend will normalize lowercase
- ✅ Password: `admin123` (plain text that matches the hash)

---

## 🧪 Testing

### Test 1: Correct Credentials
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@revticket.com","password":"admin123"}'
```

**Expected:** 200 OK with token and user data

### Test 2: Wrong Password
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@revticket.com","password":"wrongpassword"}'
```

**Expected:** 401 Unauthorized with "Invalid email or password"

### Test 3: Wrong Email
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"wrong@email.com","password":"admin123"}'
```

**Expected:** 401 Unauthorized with "Invalid email or password"

---

## 🔐 Password Hash Details

The BCrypt hash `$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy` corresponds to:
- **Plain text:** `admin123`
- **Algorithm:** BCrypt
- **Cost factor:** 10
- **Format:** `$2a$10$[salt][hash]`

Spring Security's `BCryptPasswordEncoder` will automatically verify this.

---

## 📋 Summary

**What was fixed:**
1. ✅ Case-insensitive role handling (accepts both "ADMIN" and "admin")
2. ✅ Proper BCrypt password verification
3. ✅ Better error messages
4. ✅ Exception handling improvements

**What to do:**
1. Run `FIX_ADMIN_USER.sql` to ensure admin user is correct
2. Verify with `VERIFY_ADMIN_USER.sql`
3. Test login with credentials

**Admin Credentials:**
- Email: `admin@revticket.com`
- Password: `admin123`

