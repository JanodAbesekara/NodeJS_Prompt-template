# Node.js Backend API

Production-oriented REST API built with **Node.js**, **Express**, **MongoDB (Mongoose)**, **JWT** (access + refresh tokens), **role-based authorization**, **express-validator**, and **MVC-style** layering.

## Features

- User registration and login with **bcryptjs** password hashing
- **JWT access tokens** (short-lived) and **refresh tokens** (rotated, stored hashed server-side)
- Roles: `admin`, `user`
- Admin: list/search/sort/paginate users, view user by id, delete users, dashboard statistics
- Users: update own profile; admins can update any user (including role)
- Security: Helmet, CORS, rate limiting, centralized errors, input validation
- Optional **admin seed** via CLI or startup flag

## Requirements

- Node.js **18+**
- MongoDB **6+** (local or Atlas)

## Project layout

```
backend/
├── server.js                 # Entry: DB connect, HTTP listen
├── package.json
├── .env.example
├── README.md
└── src/
    ├── app.js                # Express app + global middleware
    ├── config/
    │   ├── loadEnv.js        # Loads `.env` before other modules
    │   ├── env.js            # Validated environment
    │   └── db.js             # Mongo connection
    ├── constants/
    │   └── roles.js
    ├── controllers/
    │   ├── adminController.js
    │   ├── authController.js
    │   └── userController.js
    ├── middleware/
    │   ├── auth.js
    │   ├── authorize.js
    │   ├── errorHandler.js
    │   ├── notFound.js
    │   └── validateRequest.js
    ├── models/
    │   └── User.js
    ├── routes/
    │   ├── adminRoutes.js
    │   ├── authRoutes.js
    │   ├── userRoutes.js
    │   └── index.js
    ├── scripts/
    │   └── seedAdmin.js      # Idempotent admin user creation
    ├── services/
    │   ├── authService.js
    │   ├── tokenService.js
    │   └── userService.js
    ├── utils/
    │   ├── ApiError.js
    │   ├── catchAsync.js
    │   ├── cryptoUtils.js
    │   └── response.js
    └── validators/
        ├── authValidators.js
        └── userValidators.js
```

## Setup

1. **Install dependencies** (from the `backend` folder):

   ```bash
   cd backend
   npm install
   ```

2. **Environment file**

   ```bash
   copy .env.example .env
   ```

   On macOS/Linux:

   ```bash
   cp .env.example .env
   ```

3. **Edit `.env`**

   - Set `MONGODB_URI` to your MongoDB connection string.
   - Set strong random values for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` (each **≥ 32 characters**).
   - For seeding an admin, set `ADMIN_EMAIL` and `ADMIN_PASSWORD` (and optionally `ADMIN_NAME`).

4. **Start MongoDB** (if you use a local instance).

   If you use **MongoDB Atlas**, set `MONGODB_URI` to your connection string. If your database password contains special characters such as `@`, `#`, or `/`, you must **URL-encode** the password when embedding it in the URI (for example encode `@` as `%40`).

5. **(Optional) Create the initial admin user**

   ```bash
   npm run seed
   ```

   Or set `SEED_ADMIN_ON_START=true` in `.env` to upsert admin when the server starts (recommended for development only).

## Run

**Development (with nodemon):**

```bash
npm run dev
```

**Production:**

```bash
npm start
```

Default URL: `http://localhost:5000` (override with `PORT` in `.env`).

**Health check**

```http
GET /api/health
```

---

## API overview

Base path: `/api`

### Authentication (`/api/auth`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Register user (`user` role) |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/refresh` | No | New access + refresh tokens (body: `refreshToken`) |
| POST | `/api/auth/logout` | Bearer access | Invalidate refresh token server-side |
| GET | `/api/auth/profile` | Bearer access | Current user profile |

Send access token as:

```http
Authorization: Bearer <access_token>
```

### Users (`/api/users`)

| Method | Path | Roles | Notes |
|--------|------|-------|--------|
| GET | `/api/users` | admin | Pagination, search, sort |
| GET | `/api/users/:id` | admin | Single user |
| PUT | `/api/users/:id` | admin or **owner** | Update profile (users cannot set `role`) |
| DELETE | `/api/users/:id` | admin | Delete user |

**List query parameters**

| Param | Description |
|-------|-------------|
| `page` | Page number (default `1`) |
| `limit` | Page size (default `10`, max `100`) |
| `search` | Case-insensitive match on name or email |
| `sortBy` | `name`, `email`, `createdAt`, `role` |
| `sortOrder` | `asc` or `desc` |

### Admin (`/api/admin`)

| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| GET | `/api/admin/dashboard` | admin | Totals and recent registrations |

---

## Example requests

Replace URLs and tokens as needed.

**Register**

```bash
curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Jane Doe\",\"email\":\"jane@example.com\",\"password\":\"password123\"}"
```

**Login**

```bash
curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"jane@example.com\",\"password\":\"password123\"}"
```

**Refresh tokens**

```bash
curl -s -X POST http://localhost:5000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"<refresh_token>\"}"
```

**Profile (protected)**

```bash
curl -s http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer <access_token>"
```

**List users (admin)**

```bash
curl -s "http://localhost:5000/api/users?page=1&limit=10&search=jane&sortBy=createdAt&sortOrder=desc" \
  -H "Authorization: Bearer <access_token>"
```

---

## Response shape

**Success**

```json
{
  "success": true,
  "message": "…",
  "data": {}
}
```

**Error**

```json
{
  "success": false,
  "message": "…",
  "details": []
}
```

---

## Security notes

- Never commit `.env`. Use `.env.example` as a template.
- Use long, random JWT secrets in production.
- Prefer HTTPS in production behind a reverse proxy; `app.set("trust proxy", 1)` supports correctly reading client IP when proxied.
- Refresh tokens are hashed (SHA-256) before storage; rotation occurs on each refresh.

## License

MIT
