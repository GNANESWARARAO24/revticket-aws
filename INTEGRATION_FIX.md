# Complete Angular-Spring Boot Integration Fix

## 🔍 Issues Identified

1. ✅ **CORS** - Already configured correctly
2. ❌ **AuthService** - Uses mock data instead of real API
3. ❌ **MovieService** - Uses mock data instead of real API
4. ❌ **BookingService** - Completely mock, no HTTP calls
5. ❌ **SeatService** - Completely mock, no HTTP calls
6. ❌ **Showtime endpoint mismatch** - Frontend calls wrong endpoint
7. ❌ **Forgot password** - Request body format mismatch
8. ❌ **Error handling** - Missing HTTP error interceptor

## 📝 Files to Update

### Frontend Services (All need to use real API):
1. `Frontend/src/app/core/services/auth.service.ts`
2. `Frontend/src/app/core/services/movie.service.ts`
3. `Frontend/src/app/core/services/booking.service.ts`
4. `Frontend/src/app/core/services/seat.service.ts`
5. `Frontend/src/app/core/services/showtime.service.ts` (NEW - needs to be created)

### Backend Fixes:
1. `Backend/src/main/java/com/revticket/controller/AuthController.java` - Fix forgot-password
2. Add error handling interceptor in Angular

---

## 🚀 Step-by-Step Fix

### Step 1: Fix AuthService
**File:** `Frontend/src/app/core/services/auth.service.ts`

**Changes:**
- Remove mock logic
- Always use real API
- Add proper error handling

### Step 2: Fix MovieService
**File:** `Frontend/src/app/core/services/movie.service.ts`

**Changes:**
- Remove mock logic
- Always use real API
- Fix showtime endpoint

### Step 3: Fix BookingService
**File:** `Frontend/src/app/core/services/booking.service.ts`

**Changes:**
- Replace all mock data with HTTP calls
- Add HttpClient injection
- Map backend response to frontend model

### Step 4: Fix SeatService
**File:** `Frontend/src/app/core/services/seat.service.ts`

**Changes:**
- Replace mock with HTTP calls
- Create proper seat layout from backend response

### Step 5: Fix Backend AuthController
**File:** `Backend/src/main/java/com/revticket/controller/AuthController.java`

**Changes:**
- Fix forgot-password to accept JSON body

### Step 6: Add Error Interceptor
**File:** `Frontend/src/app/core/interceptors/error.interceptor.ts` (NEW)

**Purpose:**
- Handle HTTP errors globally
- Show user-friendly error messages

---

## ✅ Verification Checklist

After fixes:
- [ ] Login works with real backend
- [ ] Signup works with real backend
- [ ] Movies load from backend
- [ ] Showtimes load from backend
- [ ] Bookings create/read from backend
- [ ] Seats load from backend
- [ ] CORS errors resolved
- [ ] JWT token added to headers
- [ ] Error messages display properly

---

## 🧪 Test Commands

```bash
# Test Backend
curl http://localhost:8080/api/movies

# Test Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Test with Token
curl http://localhost:8080/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

