# Database Setup Guide

## Quick Answer

**You need to create the database manually** - it's more reliable than automatic creation.

## Option 1: Manual Database Creation (Recommended)

### Step 1: Connect to MySQL

```bash
mysql -u root -p
```

Enter your MySQL root password when prompted.

### Step 2: Create Database

```sql
CREATE DATABASE IF NOT EXISTS revticket_db;
```

### Step 3: Verify

```sql
SHOW DATABASES;
```

You should see `revticket_db` in the list.

### Step 4: Exit MySQL

```sql
EXIT;
```

### Step 5: Run Spring Boot

```bash
cd Backend
mvn spring-boot:run
```

**Hibernate will automatically create all tables** when Spring Boot starts (because of `spring.jpa.hibernate.ddl-auto=update`).

---

## Option 2: Using SQL Script

### Method A: Command Line

```bash
cd Backend
mysql -u root -p < DATABASE_SETUP.sql
```

### Method B: MySQL Client

```bash
mysql -u root -p
```

Then in MySQL:

```sql
source DATABASE_SETUP.sql
```

---

## Option 3: Automatic Creation (May Not Work)

Your `application.properties` has:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/revticket_db?createDatabaseIfNotExist=true
```

This **might** create the database automatically **IF**:
- Your MySQL user has `CREATE DATABASE` privilege
- MySQL server allows database creation via JDBC

**However, this often fails** because:
- MySQL users typically don't have CREATE DATABASE privilege
- Some MySQL configurations block automatic database creation

**Recommendation:** Use Option 1 (manual creation) - it's more reliable.

---

## What Happens After Database Creation?

1. **Database created** → `revticket_db` exists
2. **Spring Boot starts** → Hibernate checks tables
3. **Tables don't exist** → Hibernate creates them automatically
4. **Tables exist** → Hibernate updates them if schema changed

This is because of:
```properties
spring.jpa.hibernate.ddl-auto=update
```

---

## Verify Database Setup

### Check Database Exists

```bash
mysql -u root -p -e "SHOW DATABASES;" | grep revticket_db
```

### Check Tables Created (After Spring Boot Starts)

```bash
mysql -u root -p -e "USE revticket_db; SHOW TABLES;"
```

You should see:
- users
- movies
- movie_genres
- theaters
- showtimes
- seats
- bookings
- booking_seats
- payments

---

## Troubleshooting

### Error: "Access denied for user"
**Solution:** Check MySQL username/password in `application.properties`

### Error: "Unknown database 'revticket_db'"
**Solution:** Create database manually using Option 1

### Error: "Table already exists"
**Solution:** This is fine - Hibernate will update it

### Error: "Connection refused"
**Solution:** 
- Check MySQL is running: `mysql -u root -p`
- Check port 3306 is not blocked
- Verify MySQL service is started

---

## Summary

1. ✅ **Create database manually** (one-time setup)
2. ✅ **Spring Boot will create tables automatically** (via Hibernate)
3. ✅ **No need to run table creation scripts** (Hibernate does it)

**Just create the database, then start Spring Boot!**

