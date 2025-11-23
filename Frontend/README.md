# RevTicket - Movie Booking System

A comprehensive Angular 18 application for movie ticket booking with role-based authentication (User + Admin).

## 🎬 Features

### User Features
- Browse and search movies
- View movie details and showtimes
- Select seats and book tickets
- Secure payment processing
- Booking history and management

### Admin Features
- Dashboard with analytics
- Movie management (Add/Edit/Delete)
- Showtime management
- Booking reports and analytics
- User management

## 🏗️ Project Structure

```
src/
├── app/
│   ├── core/                 # Core services, guards, models
│   │   ├── guards/          # Route guards (auth, admin, user)
│   │   ├── interceptors/    # HTTP interceptors
│   │   ├── models/          # TypeScript interfaces
│   │   ├── services/        # Business logic services
│   │   └── utils/           # Utility functions
│   ├── shared/              # Reusable components
│   │   └── components/      # Shared UI components
│   ├── auth/                # Authentication module
│   ├── user/                # User-facing pages
│   │   ├── pages/          # User pages
│   │   └── components/     # User-specific components
│   ├── admin/               # Admin module
│   │   ├── pages/          # Admin pages
│   │   └── components/     # Admin-specific components
│   └── app-routing.module.ts
├── assets/                  # Static assets
│   ├── images/
│   ├── icons/
│   └── styles/
└── environments/            # Environment configurations
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Angular CLI (v18)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd RevTicket
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
ng serve
```

4. Open your browser and navigate to `http://localhost:4200`

## 🔐 Authentication & Authorization

The application implements role-based access control:

- **Public Routes**: Home, Login, Signup
- **User Routes**: Movie booking, profile management
- **Admin Routes**: Dashboard, movie/show management, reports

### Route Guards
- `AuthGuard`: Protects authenticated routes
- `UserGuard`: Ensures user-only access
- `AdminGuard`: Ensures admin-only access

## 🛠️ Built With

- **Angular 18** - Frontend framework
- **TypeScript** - Programming language
- **RxJS** - Reactive programming
- **Angular Router** - Navigation
- **Angular Forms** - Form handling
- **CSS3** - Styling

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## 🔧 Development

### Code Structure
- **Services**: Handle API communication and business logic
- **Guards**: Protect routes based on authentication/authorization
- **Interceptors**: Handle HTTP requests (JWT tokens)
- **Models**: TypeScript interfaces for type safety
- **Components**: Reusable UI components

### Best Practices
- Lazy loading for feature modules
- Reactive forms with validation
- Error handling and loading states
- Type-safe development with TypeScript
- Modular architecture

## 🚀 Deployment

### Build for Production
```bash
ng build --prod
```

### Environment Configuration
Update `src/environments/environment.prod.ts` with production API URLs.

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please contact the development team.