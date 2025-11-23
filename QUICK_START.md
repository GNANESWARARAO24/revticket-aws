# Quick Start Guide - RevTicket Project

## 🚀 Fastest Way to Run

### Prerequisites Check
```bash
# Check Java (need 17+)
java -version

# Check Maven
mvn -version

# Check Node.js (need 18+)
node -v

# Check Angular CLI
ng version
```

If Angular CLI is not installed:
```bash
npm install -g @angular/cli
```

### Step 1: Setup Database (One-time)

```bash
# Start MySQL and create database
mysql -u root -p
```

In MySQL prompt:
```sql
CREATE DATABASE revticket_db;
EXIT;
```

### Step 2: Configure Backend

Edit `Backend/src/main/resources/application.properties`:
```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### Step 3: Run Backend

**Terminal 1:**
```bash
cd Backend
mvn clean install
mvn spring-boot:run
```

Wait for: `Started RevTicketApplication in X.XXX seconds`

### Step 4: Run Frontend

**Terminal 2 (new terminal):**
```bash
cd Frontend
npm install
ng serve
```

Wait for: `✔ Compiled successfully.`

### Step 5: Open Application

Open browser: **http://localhost:4200**

---

## 📋 Complete Command List

### Backend (Terminal 1):
```bash
cd /Users/harshwarbhe/Downloads/RevTicketProject/Backend
mvn spring-boot:run
```

### Frontend (Terminal 2):
```bash
cd /Users/harshwarbhe/Downloads/RevTicketProject/Frontend
npm install  # First time only
ng serve
```

---

## ✅ Verify Everything Works

1. **Backend API Test:**
   ```bash
   curl http://localhost:8080/api/movies
   ```
   Should return: `[]` or JSON array

2. **Frontend:**
   - Open: http://localhost:4200
   - Should see the RevTicket homepage

3. **Test Login:**
   - Click "Sign Up" to create account
   - Or login if you have credentials

---

## 🔧 Common Issues & Fixes

### Issue: "Port 8080 already in use"
**Fix:** Change backend port in `Backend/src/main/resources/application.properties`:
```properties
server.port=8081
```
Then update `Frontend/src/environments/environment.ts`:
```typescript
apiUrl: 'http://localhost:8081/api'
```

### Issue: "Cannot connect to database"
**Fix:** 
1. Check MySQL is running: `mysql -u root -p`
2. Verify password in `application.properties`
3. Check database exists: `SHOW DATABASES;`

### Issue: "npm install fails"
**Fix:**
```bash
cd Frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Issue: "ng: command not found"
**Fix:**
```bash
npm install -g @angular/cli
```

### Issue: "Java version error"
**Fix:** Install Java 17+ and set JAVA_HOME:
```bash
export JAVA_HOME=/path/to/java17
```

---

## 🎯 What to Expect

### Backend Console:
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.0)

Started RevTicketApplication in X.XXX seconds
```

### Frontend Console:
```
✔ Browser application bundle generation complete.
✔ Compiled successfully.

** Angular Live Development Server is listening on localhost:4200 **
```

---

## 📱 Access Points

- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:8080/api
- **API Docs:** Check `Backend/README.md` for endpoint list

---

## 🆘 Still Having Issues?

1. Check `RUN_PROJECT.md` for detailed troubleshooting
2. Verify all prerequisites are installed
3. Check console logs for specific error messages
4. Ensure MySQL is running
5. Verify ports 8080 and 4200 are not in use

---

## 💡 Pro Tips

1. **Keep both terminals open** - Backend and Frontend need to run simultaneously
2. **Check backend first** - If API doesn't work, frontend won't work
3. **Use browser DevTools** - Check Network tab for API calls
4. **Check console logs** - Both backend and frontend show helpful errors

