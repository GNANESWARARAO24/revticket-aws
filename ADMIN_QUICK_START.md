# 🚀 Admin Login - Quick Start Guide

## ⚡ 3-Step Setup

### Step 1: Create Admin User

```bash
cd Backend
mysql -u root -p revticket_db < CREATE_ADMIN_USER.sql
```

**Or manually:**
```sql
USE revticket_db;
INSERT INTO users (id, email, name, password, role, created_at) 
VALUES (UUID(), 'admin@revticket.com', 'Admin User', 
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 
        'ADMIN', NOW());
```

### Step 2: Start Application

```bash
# Terminal 1 - Backend
cd Backend
mvn spring-boot:run

# Terminal 2 - Frontend
cd Frontend
ng serve
```

### Step 3: Login as Admin

1. Open: http://localhost:4200
2. Click "Login"
3. Click "Use Admin Account" button
4. Or enter manually:
   - **Email:** `admin@revticket.com`
   - **Password:** `admin123`
5. You'll be redirected to `/admin/dashboard`

---

## ✅ What's Working

- ✅ Admin login with role detection
- ✅ Quick login buttons for easy testing
- ✅ Role-based routing (Admin → Dashboard, User → Home)
- ✅ Admin guard protects `/admin/*` routes
- ✅ Backend protects admin API endpoints
- ✅ Navbar shows admin links when logged in as admin

---

## 🎯 Admin Credentials

- **Email:** `admin@revticket.com`
- **Password:** `admin123`
- **Role:** `ADMIN`

---

## 📋 Admin Features

Once logged in as admin, you can:
- Access admin dashboard
- Manage movies (add, edit, delete)
- Manage theaters
- Manage showtimes
- View booking reports
- Access all admin API endpoints

---

## 🔍 Verify It Works

1. **Login as Admin** → Should redirect to `/admin/dashboard`
2. **Try accessing** `/admin/manage-movies` → Should work
3. **Check navbar** → Should show admin menu items
4. **Logout and login as user** → Should redirect to `/user/home`
5. **Try accessing** `/admin/dashboard` as user → Should redirect to user home

---

## 🆘 Troubleshooting

**Can't login as admin?**
- Verify admin user exists: `SELECT * FROM users WHERE email = 'admin@revticket.com';`
- Check role is 'ADMIN' not 'USER'
- Verify password hash is correct

**Redirected to user home?**
- Check user role in localStorage
- Verify JWT token includes ADMIN role
- Check browser console for errors

**403 Forbidden on admin endpoints?**
- Verify JWT token is sent in headers
- Check token includes role claim
- Verify backend SecurityConfig allows ADMIN

---

## 📚 Full Documentation

See `ADMIN_SETUP_COMPLETE.md` for detailed information.

