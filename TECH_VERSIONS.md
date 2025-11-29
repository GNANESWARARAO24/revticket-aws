# RevTicket - Technology Versions

## 📦 Complete Tech Stack Versions

### **Frontend Technologies**

| Technology | Version | Purpose |
|------------|---------|---------|
| **Angular** | 18.0.0 | Frontend framework |
| **TypeScript** | 5.4.0 | Programming language |
| **RxJS** | 7.8.0 | Reactive programming |
| **Angular CLI** | 18.0.0 | Development tooling |
| **Node.js** | 18.7.0+ | Runtime environment |
| **npm** | Latest | Package manager |

### **Backend Technologies**

| Technology | Version | Purpose |
|------------|---------|---------|
| **Java** | 17 | Programming language |
| **Spring Boot** | 3.2.0 | Backend framework |
| **Spring Security** | 6.2.0 (via Spring Boot) | Authentication & Authorization |
| **Spring Data JPA** | 3.2.0 (via Spring Boot) | Database ORM |
| **Hibernate** | 6.4.0 (via Spring Boot) | JPA implementation |
| **Maven** | 3.6+ | Build tool |

### **Database**

| Technology | Version | Purpose |
|------------|---------|---------|
| **MySQL** | 8.0+ | Relational database |
| **MySQL Connector/J** | Latest (via Spring Boot) | JDBC driver |

### **Security & Authentication**

| Technology | Version | Purpose |
|------------|---------|---------|
| **JJWT (JWT Library)** | 0.12.3 | JSON Web Token implementation |
| **BCrypt** | Built-in Spring Security | Password hashing |

### **Development Tools**

| Technology | Version | Purpose |
|------------|---------|---------|
| **Lombok** | Latest (via Spring Boot) | Reduce boilerplate code |
| **Spring Boot DevTools** | 3.2.0 | Hot reload during development |
| **Jasmine** | 5.1.0 | Frontend testing framework |
| **Karma** | 6.4.0 | Test runner |

### **Testing Libraries**

| Technology | Version | Purpose |
|------------|---------|---------|
| **Spring Boot Test** | 3.2.0 | Backend testing |
| **Spring Security Test** | 6.2.0 | Security testing |
| **Jasmine Core** | 5.1.0 | Frontend unit testing |
| **Karma Coverage** | 2.2.0 | Code coverage |

---

## 🔧 Detailed Version Breakdown

### **Frontend (Angular 18)**

```json
{
  "dependencies": {
    "@angular/animations": "^18.0.0",
    "@angular/common": "^18.0.0",
    "@angular/compiler": "^18.0.0",
    "@angular/core": "^18.0.0",
    "@angular/forms": "^18.0.0",
    "@angular/platform-browser": "^18.0.0",
    "@angular/router": "^18.0.0",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^18.0.0",
    "@angular/cli": "^18.0.0",
    "@angular/compiler-cli": "^18.0.0",
    "@types/jasmine": "~5.1.0",
    "@types/node": "^18.7.0",
    "typescript": "~5.4.0"
  }
}
```

### **Backend (Spring Boot 3.2.0)**

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.0</version>
</parent>

<properties>
    <java.version>17</java.version>
    <jwt.version>0.12.3</jwt.version>
</properties>
```

---

## 🎯 Key Features by Version

### **Angular 18 Features Used:**
- ✅ Standalone components
- ✅ Signals for reactive state management
- ✅ Improved dependency injection
- ✅ Enhanced router features
- ✅ Better performance optimizations

### **Spring Boot 3.2.0 Features Used:**
- ✅ Native Java 17 support
- ✅ Jakarta EE 10 (jakarta.* packages)
- ✅ Improved observability
- ✅ Enhanced security features
- ✅ Better Docker support

### **Java 17 Features Used:**
- ✅ Records (for DTOs)
- ✅ Pattern matching
- ✅ Text blocks
- ✅ Sealed classes
- ✅ Enhanced switch expressions

---

## 📋 Minimum Requirements

### **Development Environment:**
- **Java:** 17 or higher
- **Node.js:** 18.7.0 or higher
- **npm:** 9.0.0 or higher
- **Maven:** 3.6.0 or higher
- **MySQL:** 8.0 or higher

### **IDE Recommendations:**
- **Backend:** IntelliJ IDEA / Eclipse / VS Code
- **Frontend:** VS Code / WebStorm
- **Database:** MySQL Workbench / DBeaver

---

## 🔄 Version Compatibility Matrix

| Component | Minimum | Recommended | Maximum Tested |
|-----------|---------|-------------|----------------|
| Java | 17 | 17 | 21 |
| Node.js | 18.7 | 20.x | 21.x |
| MySQL | 8.0 | 8.0.35 | 8.2 |
| Maven | 3.6 | 3.9 | 3.9.6 |
| Angular CLI | 18.0 | 18.0 | 18.2 |

---

## 📦 Production Dependencies Only

### **Frontend Runtime:**
```
@angular/core: 18.0.0
@angular/common: 18.0.0
@angular/router: 18.0.0
@angular/forms: 18.0.0
rxjs: 7.8.0
```

### **Backend Runtime:**
```
Spring Boot: 3.2.0
Spring Security: 6.2.0
Spring Data JPA: 3.2.0
MySQL Connector: 8.2.0
JJWT: 0.12.3
```

---

## 🚀 Why These Versions?

### **Angular 18:**
- Latest stable release with Signals
- Better performance than Angular 17
- Long-term support (LTS)
- Modern development experience

### **Spring Boot 3.2.0:**
- Latest stable Spring Boot 3.x
- Full Java 17 support
- Jakarta EE 10 compliance
- Production-ready features

### **Java 17:**
- LTS (Long Term Support) version
- Required for Spring Boot 3.x
- Modern language features
- Excellent performance

### **MySQL 8.0:**
- Latest stable major version
- JSON support
- Better performance
- Enhanced security

### **JJWT 0.12.3:**
- Latest stable JWT library
- Java 17 compatible
- Secure token handling
- Active maintenance

---

## 📝 Version Update Policy

- **Security patches:** Applied immediately
- **Minor updates:** Quarterly review
- **Major updates:** Annual evaluation
- **LTS versions:** Preferred for stability

---

## 🔍 How to Check Installed Versions

### **Java:**
```bash
java -version
# Output: openjdk version "17.0.x"
```

### **Node.js:**
```bash
node -v
# Output: v18.7.x or higher
```

### **Maven:**
```bash
mvn -v
# Output: Apache Maven 3.9.x
```

### **Angular CLI:**
```bash
ng version
# Output: Angular CLI: 18.0.x
```

### **MySQL:**
```bash
mysql --version
# Output: mysql Ver 8.0.x
```

---

## 📌 Quick Reference

**Backend Stack:** Java 17 + Spring Boot 3.2.0 + MySQL 8.0  
**Frontend Stack:** Angular 18 + TypeScript 5.4 + RxJS 7.8  
**Security:** JWT 0.12.3 + Spring Security 6.2  
**Build Tools:** Maven 3.9 + Angular CLI 18.0  

---

**Last Updated:** January 2024  
**Document Version:** 1.0
