# 🏦 Banking System
A full-stack digital banking application built with Spring Boot and React. The platform supports secure customer banking operations, administrator account management, JWT-based authentication, role-based access control, and transaction history tracking.

## 📌 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Security](#security)
- [Build](#build)
- [Author](#author)

## 📖 Overview
Banking System is a full-stack web application that provides a digital banking platform with two roles — **Customer** and **Admin**. Customers can register, create accounts, deposit and withdraw money, and view their transaction history. Admins can manage all users and accounts, including blocking and unblocking accounts. All APIs are secured using Spring Security and JWT authentication.

## ✅ Features

### 👤 Customer
- Register and log in securely
- View personal dashboard with account summary
- Create savings or current bank accounts
- Deposit and withdraw money
- View passbook and full transaction history

### 🛡️ Admin
- View all registered users
- View all bank accounts
- Block and unblock customer accounts
- Role-based access — admin routes are fully protected

### 🔐 Security
- JWT-based stateless authentication
- BCrypt password encryption
- Role-based access control (CUSTOMER / ADMIN)
- Secure REST APIs with Spring Security
- Swagger UI for API documentation

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Java 21 | Core programming language |
| Spring Boot | Backend framework |
| Spring Security | Authentication and authorization |
| Spring Data JPA | Database ORM |
| JWT | Stateless token-based authentication |
| MySQL | Relational database |
| Maven | Build and dependency management |
| Swagger / OpenAPI | API documentation |

### Frontend
| Technology | Purpose |
|---|---|
| React | Frontend UI library |
| Vite | Frontend build tool |
| React Router | Client-side routing |
| Axios | HTTP client for API calls |
| Bootstrap | UI styling and layout |
| React Toastify | Notification alerts |

## 📁 Project Structure
Banking Application/
├── BankingSystem/                         # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/Laxman/BankingSystem/
│   │   │   │       ├── config/            # Security, CORS, data initialization
│   │   │   │       ├── controller/        # REST API controllers
│   │   │   │       ├── dto/               # Request and response DTOs
│   │   │   │       ├── entity/            # JPA entities
│   │   │   │       ├── exception/         # Global exception handling
│   │   │   │       ├── repository/        # Spring Data JPA repositories
│   │   │   │       ├── security/          # JWT and authentication filters
│   │   │   │       ├── service/           # Business logic
│   │   │   │       └── BankingSystemApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties # Application configuration
│   │   └── test/                          # Backend tests
│   ├── pom.xml                            # Maven dependencies
│   ├── mvnw                               # Maven Wrapper for Linux/macOS
│   └── mvnw.cmd                           # Maven Wrapper for Windows
│
└── BankingSystem-Frontend/                # Frontend root
    ├── package.json                       # Root npm scripts
    └── banking-frontend/                  # React + Vite application
        ├── public/                        # Static public assets
        ├── src/
        │   ├── api/                       # Axios API configuration
        │   ├── assets/                    # Images and static frontend assets
        │   ├── components/                # Reusable React components
        │   ├── context/                   # Authentication context
        │   ├── pages/
        │   │   ├── admin/                 # Admin dashboard and management pages
        │   │   ├── auth/                  # Login and registration pages
        │   │   └── user/                  # Customer banking pages
        │   ├── App.jsx                    # Application routes
        │   ├── main.jsx                   # React entry point
        │   └── index.css                  # Global styles
        ├── .env.example                   # Example frontend environment variables
        ├── package.json                   # Frontend dependencies and scripts
        ├── vite.config.js                 # Vite configuration
        └── index.html                     # HTML entry file

## ⚙️ Prerequisites
Make sure the following are installed on your machine before running the project:

| Tool | Version | Purpose |
|---|---|---|
| Java | 21 | Run Spring Boot backend |
| Node.js + npm | Latest LTS | Run React frontend |
| MySQL | 8.0+ | Database |
| Git | Any | Version control |

> Maven is not required separately — the backend includes **Maven Wrapper** (`mvnw.cmd`).

## 🚀 Backend Setup

**1. Navigate to the backend directory:**
```bash
cd BankingSystem
```

**2. Create the MySQL database:**
```sql
CREATE DATABASE bankingDB;
```

**3. Set environment variables (PowerShell):**
```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/bankingDB"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your_mysql_password"
$env:JWT_SECRET="your-long-secure-jwt-secret-key"
$env:ADMIN_EMAIL="admin@banking.com"
$env:ADMIN_PASSWORD="your_admin_password"
```

**4. Run the backend:**
```bash
.\mvnw.cmd spring-boot:run
```

The backend starts on: **http://localhost:8085**

> Swagger API docs available at: **http://localhost:8085/swagger-ui.html**

## 💻 Frontend Setup

**1. Navigate to the frontend directory:**
```bash
cd BankingSystem-Frontend
```

**2. Install dependencies:**
```bash
npm install --prefix banking-frontend
```

**3. Create a `.env` file inside `banking-frontend/`:**
```env
VITE_API_URL=http://localhost:8085
```

**4. Run the frontend:**
```bash
npm run dev
```

The frontend starts on: **http://localhost:5173**

> If port 5173 is busy, Vite will automatically use the next available port (e.g. 5174).

## 🔑 Environment Variables

### Backend

| Variable | Description | Example |
|---|---|---|
| DB_URL | MySQL connection URL | jdbc:mysql://localhost:3306/bankingDB |
| DB_USERNAME | Database username | root |
| DB_PASSWORD | Database password | your_password |
| JWT_SECRET | Secret key for JWT signing | your-secret-key |
| JWT_EXPIRATION | Token expiry (milliseconds) | 86400000 |
| ADMIN_EMAIL | Default admin email | admin@banking.com |
| ADMIN_PASSWORD | Default admin password | your_admin_password |

### Frontend

| Variable | Description |
|---|---|
| VITE_API_URL | Backend base URL |

> ⚠️ Never commit `.env` files to GitHub. They are already excluded in `.gitignore`.

## 📡 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | /api/auth/register | Register a new user | Public |
| POST | /api/auth/login | Login and get JWT token | Public |

### 💳 Customer APIs
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | /api/accounts | Get user's accounts | Customer |
| POST | /api/accounts | Create a new account | Customer |
| GET | /api/accounts/{accountNumber} | Get account details | Customer |
| POST | /api/accounts/deposit | Deposit money | Customer |
| POST | /api/accounts/withdraw | Withdraw money | Customer |
| GET | /api/accounts/{accountNumber}/transactions | Get transaction history | Customer |

### 🛡️ Admin APIs
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | /api/admin/users | Get all registered users | Admin |
| GET | /api/admin/accounts | Get all bank accounts | Admin |
| PUT | /api/admin/block/account/{accountNumber} | Block an account | Admin |
| PUT | /api/admin/unblock/account/{accountNumber} | Unblock an account | Admin |

## 🔒 Security

- Passwords are encrypted using **BCrypt**
- Authentication uses **JSON Web Tokens (JWT)** — stateless and secure
- Every protected API validates the JWT token on each request
- Admin endpoints are restricted using **role-based access control**
- Sensitive configuration is loaded from **environment variables** — never hardcoded
- `.env` files, build outputs, and `node_modules` are excluded from Git via `.gitignore`

## 📦 Build

### Backend
```bash
cd BankingSystem
.\mvnw.cmd clean package
```
Output JAR will be in `BankingSystem/target/`

### Frontend
```bash
cd BankingSystem-Frontend
npm run build --prefix banking-frontend
```
Output will be in `BankingSystem-Frontend/banking-frontend/dist/`

## 👨‍💻 Author

**Laxman Sah**
- 🎓 MCA Student — C-DAC, Noida (GGSIPU, Delhi)
- 💼 Java Backend Developer | Spring Boot Enthusiast
- 🐙 GitHub: [Laxman1509](https://github.com/Laxman1509)
- 📧 Email: laxmansah1503@gmail.com

> ⭐ If you found this project useful, consider giving it a star on GitHub!
