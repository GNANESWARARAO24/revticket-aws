# RevTicket Backend API

Spring Boot backend application for the RevTicket movie booking system.

## Technologies Used

- **Spring Boot 3.2.0**
- **Java 17**
- **MySQL 8.0**
- **Spring Security** with JWT authentication
- **Spring Data JPA**
- **Maven**

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0 or higher

## Setup Instructions

### 1. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE revticket_db;
```

Update the database credentials in `src/main/resources/application.properties`:

```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 2. Build and Run

```bash
# Navigate to Backend directory
cd Backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/forgot-password` - Password reset request

### Movies
- `GET /api/movies` - Get all active movies
- `GET /api/movies/{id}` - Get movie by ID
- `POST /api/movies` - Create movie (Admin only)
- `PUT /api/movies/{id}` - Update movie (Admin only)
- `DELETE /api/movies/{id}` - Delete movie (Admin only)

### Theaters
- `GET /api/theaters` - Get all active theaters
- `GET /api/theaters/{id}` - Get theater by ID
- `POST /api/theaters` - Create theater (Admin only)
- `PUT /api/theaters/{id}` - Update theater (Admin only)
- `DELETE /api/theaters/{id}` - Delete theater (Admin only)

### Showtimes
- `GET /api/showtimes/movie/{movieId}` - Get showtimes for a movie
- `GET /api/showtimes/movie/{movieId}?date=YYYY-MM-DD` - Get showtimes for a movie on a specific date
- `GET /api/showtimes/{id}` - Get showtime by ID
- `POST /api/showtimes` - Create showtime (Admin only)
- `PUT /api/showtimes/{id}` - Update showtime (Admin only)
- `DELETE /api/showtimes/{id}` - Delete showtime (Admin only)

### Bookings
- `POST /api/bookings` - Create a new booking (Authenticated)
- `GET /api/bookings/my-bookings` - Get user's bookings (Authenticated)
- `GET /api/bookings/{id}` - Get booking by ID
- `POST /api/bookings/{id}/cancel` - Cancel a booking
- `GET /api/bookings/all` - Get all bookings (Admin only)

### Seats
- `GET /api/seats/showtime/{showtimeId}` - Get seats for a showtime
- `POST /api/seats/showtime/{showtimeId}/initialize` - Initialize seats for a showtime
- `POST /api/seats/hold` - Hold seats temporarily
- `POST /api/seats/release` - Release held seats

### Payments
- `POST /api/payments` - Process payment
- `GET /api/payments/{transactionId}/status` - Get payment status

### Users
- `GET /api/users/profile` - Get current user profile (Authenticated)
- `PUT /api/users/profile` - Update user profile (Authenticated)
- `GET /api/users` - Get all users (Admin only)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Default Admin User

You can create an admin user by running the application and using the signup endpoint, then manually updating the role in the database:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@revticket.com';
```

Or create it directly:

```sql
INSERT INTO users (id, email, name, password, role, created_at) 
VALUES (UUID(), 'admin@revticket.com', 'Admin User', '$2a$10$...', 'ADMIN', NOW());
```

Note: The password must be BCrypt encoded.

## CORS Configuration

The API is configured to accept requests from `http://localhost:4200` (Angular frontend). Update this in `SecurityConfig.java` if needed.

## Project Structure

```
Backend/
├── src/
│   ├── main/
│   │   ├── java/com/revticket/
│   │   │   ├── config/          # Configuration classes
│   │   │   ├── controller/      # REST controllers
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── entity/          # JPA entities
│   │   │   ├── repository/      # JPA repositories
│   │   │   ├── security/        # Security configuration
│   │   │   ├── service/         # Business logic
│   │   │   └── util/            # Utility classes
│   │   └── resources/
│   │       └── application.properties
│   └── test/
└── pom.xml
```

## Development

### Running Tests

```bash
mvn test
```

### Building for Production

```bash
mvn clean package
```

The JAR file will be created in the `target` directory.

## Notes

- The application uses Hibernate's `ddl-auto=update` which automatically creates/updates database tables
- JWT tokens expire after 24 hours (configurable in `application.properties`)
- Password encryption uses BCrypt
- All timestamps are stored in UTC

