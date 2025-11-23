# Database Modification Guide for Admin Login

## Quick Answer

**If Hibernate created your database automatically:**

- ✅ **No schema modification needed** - Just create admin user
- Run: `DATABASE_MODIFICATION_SIMPLE.sql`

**If you created database manually:**

- ⚠️ **May need to verify/modify schema**
- Run: `DATABASE_CHECK.sql` first to check
- Then run: `DATABASE_MODIFICATION.sql` if needed

---

## Step-by-Step Process

### Step 1: Check Your Database

```bash
mysql -u root -p revticket_db < DATABASE_CHECK.sql
```

This will show you:

- ✓ If users table exists
- ✓ If role column exists
- ✓ If role column supports ADMIN
- ✓ If admin user exists

### Step 2: Based on Results

#### Scenario A: Hibernate Created Database (Most Common)

If you see:

- ✓ Users table exists
- ✓ Role column exists
- ✓ Role column supports ADMIN
- ✗ Admin user does NOT exist

**Action:** Just create admin user

```bash
mysql -u root -p revticket_db < DATABASE_MODIFICATION_SIMPLE.sql
```

#### Scenario B: Manual Database Creation

If you see:

- ✓ Users table exists
- ✗ Role column does NOT support ADMIN

**Action:** Modify schema and create admin user

```bash
mysql -u root -p revticket_db < DATABASE_MODIFICATION.sql
```

#### Scenario C: Database Doesn't Exist

**Action:** Create database first

```bash
mysql -u root -p < DATABASE_SETUP.sql
```

---

## SQL Commands Reference

### Quick Admin User Creation (If schema is correct)

```sql
USE revticket_db;

-- Create admin user
INSERT INTO users (
    id, email, name, password, role, phone, created_at
) VALUES (
    UUID(),
    'admin@revticket.com',
    'Admin User',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'ADMIN',
    NULL,
    NOW()
);
```

### Modify Role Column (If needed)

```sql
USE revticket_db;

-- Ensure role column supports ADMIN
ALTER TABLE users
MODIFY COLUMN role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER';
```

### Verify Admin User

```sql
USE revticket_db;

SELECT id, email, name, role, created_at
FROM users
WHERE email = 'admin@revticket.com';
```

---

## Common Scenarios

### ✅ Scenario 1: Fresh Database (Hibernate Auto-Created)

**What happened:**

- You started Spring Boot
- Hibernate created tables automatically
- Schema is correct

**What to do:**

```bash
mysql -u root -p revticket_db < DATABASE_MODIFICATION_SIMPLE.sql
```

### ⚠️ Scenario 2: Manual Database Creation

**What happened:**

- You ran DATABASE_SETUP.sql manually
- Tables were created from SQL script
- Schema should be correct, but verify

**What to do:**

```bash
# Check first
mysql -u root -p revticket_db < DATABASE_CHECK.sql

# If role column is correct, just create admin
mysql -u root -p revticket_db < DATABASE_MODIFICATION_SIMPLE.sql
```

### 🔧 Scenario 3: Existing Database Needs Update

**What happened:**

- Database existed before admin feature
- Role column might not support ADMIN

**What to do:**

```bash
# Check current state
mysql -u root -p revticket_db < DATABASE_CHECK.sql

# Modify if needed
mysql -u root -p revticket_db < DATABASE_MODIFICATION.sql
```

---

## Verification Commands

### Check Table Structure

```sql
USE revticket_db;
DESCRIBE users;
```

Should show:

```
+------------+----------------------+------+-----+---------+-------+
| Field      | Type                 | Null | Key | Default | Extra |
+------------+----------------------+------+-----+---------+-------+
| id         | varchar(36)          | NO   | PRI | NULL    |       |
| email      | varchar(255)          | NO   | UNI | NULL    |       |
| name       | varchar(255)          | NO   |     | NULL    |       |
| password   | varchar(255)          | NO   |     | NULL    |       |
| role       | enum('USER','ADMIN') | NO   |     | USER    |       |
| phone      | varchar(20)          | YES  |     | NULL    |       |
| created_at | timestamp            | NO   |     | NULL    |       |
+------------+----------------------+------+-----+---------+-------+
```

### Check Admin User

```sql
USE revticket_db;
SELECT email, name, role FROM users WHERE role = 'ADMIN';
```

Should show:

```
+----------------------+------------+-------+
| email                | name       | role  |
+----------------------+------------+-------+
| admin@revticket.com  | Admin User | ADMIN |
+----------------------+------------+-------+
```

---

## Troubleshooting

### Error: "Unknown column 'role'"

**Solution:** Run `DATABASE_MODIFICATION.sql` to add/modify role column

### Error: "Invalid enum value"

**Solution:** Run the ALTER TABLE command to update enum values

### Error: "Duplicate entry for email"

**Solution:** Admin user already exists. Delete first:

```sql
DELETE FROM users WHERE email = 'admin@revticket.com';
```

### Error: "Table 'users' doesn't exist"

**Solution:** Create database first:

```bash
mysql -u root -p < DATABASE_SETUP.sql
```

---

## Summary

**Most likely scenario:** Your database was created by Hibernate and already has the correct schema. You just need to create the admin user:

```bash
mysql -u root -p revticket_db < DATABASE_MODIFICATION_SIMPLE.sql
```

**If unsure:** Check first, then modify if needed:

```bash
# Check
mysql -u root -p revticket_db < DATABASE_CHECK.sql

# Modify if needed
mysql -u root -p revticket_db < DATABASE_MODIFICATION.sql
```
