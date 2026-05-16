# Build a Production Ready Node.js Backend API

Create a complete production-level backend using:

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Role-Based Authorization
- REST API Architecture
- MVC Pattern
- Clean Folder Structure
- Environment Variables
- Validation
- Error Handling
- Security Best Practices

---

# Project Requirements

Build a backend API system with:

## Authentication Features
- User Registration
- User Login
- JWT Access Token
- Password Hashing using bcrypt
- Refresh Token Support
- Logout
- Protected Routes

## User Roles
Implement:
- Admin
- User

Admin can:
- Manage all users
- Delete users
- View dashboard stats

Users can:
- Manage own profile

---

# Required Technologies

Use:

- express
- mongoose
- dotenv
- bcryptjs
- jsonwebtoken
- cors
- helmet
- morgan
- express-rate-limit
- cookie-parser
- express-validator
- nodemon

---

# Folder Structure

Create clean architecture:

backend/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validators/
│   └── app.js
│
├── server.js
├── .env
├── .gitignore
├── package.json
└── README.md

---

# API Requirements

## Auth APIs

### POST /api/auth/register
Register new user

### POST /api/auth/login
Login user

### POST /api/auth/logout
Logout user

### GET /api/auth/profile
Get current logged user profile

---

# User APIs

### GET /api/users
Admin only

### GET /api/users/:id
Admin only

### PUT /api/users/:id
Admin or owner

### DELETE /api/users/:id
Admin only

---

# Database Schema

## User Model

Fields:
- name
- email
- password
- role
- createdAt
- updatedAt

Email must be unique.

Password must be hashed before save.

---

# Middleware Requirements

Create middleware for:

- Authentication
- Authorization
- Error Handling
- Validation
- Not Found Routes

---

# Security Requirements

Implement:
- Helmet
- Rate Limiting
- CORS
- Secure Password Hashing
- JWT Expiration
- Environment Variables

---

# Validation Rules

Validate:
- Email format
- Password minimum length
- Required fields

Return proper error messages.

---

# Response Format

Use standard JSON response format:

{
  "success": true,
  "message": "User created successfully",
  "data": {}
}

---

# Additional Requirements

- Use async/await
- Use centralized error handling
- Use reusable utility functions
- Use proper HTTP status codes
- Add comments for important sections
- Follow clean code principles
- Make code beginner friendly
- Include sample .env file
- Include API testing examples

---

# README Requirements

Generate README.md with:
- Setup instructions
- Installation
- Environment variables
- Run commands
- API endpoints
- Example requests

---

# Final Output

Generate:
- Complete backend source code
- All folders and files
- package.json
- MongoDB connection setup
- JWT implementation
- Middleware
- Controllers
- Routes
- Models
- Validation
- README

Ensure the backend is fully runnable without missing files.