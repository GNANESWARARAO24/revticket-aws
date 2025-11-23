# Setup Guide for RevTicket Backend

## Quick Start

### 1. Prerequisites
- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+

### 2. Database Setup

```sql
CREATE DATABASE revticket_db;
```

### 3. Configure Database

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.username=root
spring.datasource.password=your_password
```

### 4. Build and Run

```bash
cd Backend
mvn clean install
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`

### 5. Test the API

```bash
# Health check (after starting)
curl http://localhost:8080/api/movies
```

## Creating Admin User

After starting the application, you can create an admin user via SQL:

```sql
USE revticket_db;

-- Create admin user (password: admin123)
-- Password is BCrypt encoded: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
INSERT INTO users (id, email, name, password, role, created_at) 
VALUES (UUID(), 'admin@revticket.com', 'Admin User', 
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 
        'ADMIN', NOW());
```

Or use the signup endpoint and manually update the role:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your_email@example.com';
```

## API Testing with Postman/curl

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@revticket.com","password":"user123"}'
```

### Get Movies (Public)
```bash
curl http://localhost:8080/api/movies
```

### Create Movie (Admin - requires JWT token)
```bash
curl -X POST http://localhost:8080/api/movies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Test Movie",
    "description": "Test Description",
    "genre": ["Action", "Drama"],
    "duration": 120,
    "rating": 8.5,
    "releaseDate": "2024-01-01",
    "language": "English",
    "isActive": true
  }'
```

## Troubleshooting

### Port Already in Use
Change the port in `application.properties`:
```properties
server.port=8081
```

### Database Connection Error
- Verify MySQL is running
- Check username/password in `application.properties`
- Ensure database `revticket_db` exists

### JWT Token Issues
- Check `jwt.secret` in `application.properties`
- Ensure token is included in Authorization header: `Bearer <token>`

## Development Tips

1. **Hot Reload**: Spring Boot DevTools is included for automatic restarts
2. **Database Logging**: SQL queries are logged (set `spring.jpa.show-sql=false` in production)
3. **CORS**: Currently allows `http://localhost:4200` - update `SecurityConfig.java` if needed

