# DSA Sheet Backend

Production-ready REST API for the DSA Sheet Web Application built with Node.js, Express, MongoDB, and TypeScript.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Language**: TypeScript
- **Auth**: JWT (access + refresh tokens via HTTP-only cookies)
- **Validation**: Zod
- **Security**: Helmet, CORS, express-rate-limit
- **Docs**: Swagger / OpenAPI 3.0
- **Code Quality**: ESLint, Prettier, Husky, lint-staged

## Project Structure

```
src/
├── config/          # DB connection, env validation, Swagger
├── constants/       # HTTP status codes, app enums (roles, difficulty, XP)
├── controllers/     # HTTP layer — parse req, call service, send res
├── middleware/      # auth, error handler, Zod validate, rate-limit
├── models/          # Mongoose schemas with indexes
├── routes/          # Route definitions + aggregator index
├── services/        # Business logic (pure, no HTTP concerns)
├── utils/           # ApiError, ApiResponse, asyncHandler, cookie/slug utils
├── validations/     # Zod schemas
├── types/           # Express augmentation, model interfaces
├── lib/             # Token management (signAccessToken, verifyRefreshToken)
├── app.ts           # Express app setup
└── server.ts        # HTTP server + graceful shutdown

scripts/
└── seed/            # DB seeders with 8 topics, subtopics, 50+ problems
```

## Getting Started

### 1. Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your values. Generate secure secrets with:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Initialize Git & Husky (first time only)

```bash
git init
npm run prepare
```

### 5. Run Development Server

```bash
npm run dev
```

The server starts on `http://localhost:5000`.

### 6. Seed the Database

```bash
# Full seed (topics + subtopics + problems)
npm run seed

# Seed only topics
npm run seed:topics

# Seed subtopics + problems (requires topics to exist)
npm run seed:problems
```

### 7. Build for Production

```bash
npm run build
npm start
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login |
| POST | `/api/auth/logout` | ✅ | Logout |
| POST | `/api/auth/refresh` | ❌ | Refresh access token |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/users/profile` | ✅ | Get user profile |
| PATCH | `/api/users/profile` | ✅ | Update user profile |
| GET | `/api/topics` | ❌ | List all topics |
| GET | `/api/topics/:slug` | ❌ | Get topic by slug |
| GET | `/api/subtopics/:topicId` | ❌ | Get subtopics for a topic |
| GET | `/api/problems` | ❌ | List problems (paginated, filterable) |
| GET | `/api/problems/:slug` | ❌ | Get problem by slug |
| GET | `/api/problems/topic/:topicId` | ❌ | Get problems by topic |
| POST | `/api/progress/toggle` | ✅ | Toggle problem completion |
| GET | `/api/progress/me` | ✅ | Get my progress |
| PATCH | `/api/progress/notes` | ✅ | Update notes for a problem |
| POST | `/api/bookmarks/toggle` | ✅ | Toggle bookmark |
| GET | `/api/bookmarks/me` | ✅ | Get my bookmarks |
| GET | `/api/dashboard/stats` | ✅ | Get dashboard analytics |

## API Documentation (Swagger)

Available at: `http://localhost:5000/api/docs`

## Health Check

```
GET /health
```

## Response Format

**Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "body.email", "message": "Please provide a valid email" }
  ]
}
```

## Authentication

This API uses **HTTP-only cookie-based JWT authentication**:

- **Access Token**: 15 min TTL, stored in `accessToken` cookie
- **Refresh Token**: 7 day TTL, stored in `refreshToken` cookie
- Refresh tokens are stored hashed in MongoDB for server-side invalidation
- Call `POST /api/auth/refresh` to silently rotate tokens

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix ESLint errors |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | TypeScript type check without emit |
| `npm run seed` | Full DB seed |
| `npm run seed:topics` | Seed topics only |
| `npm run seed:problems` | Seed subtopics + problems |

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | ❌ | `development` | Environment |
| `PORT` | ❌ | `5000` | Server port |
| `MONGODB_URI` | ✅ | — | MongoDB connection string |
| `CORS_ORIGIN` | ❌ | `http://localhost:3000` | Allowed origins (comma-separated) |
| `ACCESS_TOKEN_SECRET` | ✅ | — | JWT access token secret (min 32 chars) |
| `ACCESS_TOKEN_EXPIRY` | ❌ | `15m` | Access token TTL |
| `REFRESH_TOKEN_SECRET` | ✅ | — | JWT refresh token secret (min 32 chars) |
| `REFRESH_TOKEN_EXPIRY` | ❌ | `7d` | Refresh token TTL |
| `BCRYPT_SALT_ROUNDS` | ❌ | `12` | Bcrypt hash rounds |
| `RATE_LIMIT_WINDOW_MS` | ❌ | `900000` | Rate limit window (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | ❌ | `100` | Max requests per window |
| `AUTH_RATE_LIMIT_MAX` | ❌ | `10` | Max auth attempts per window |

## Database Models

- **User**: name, email, password (hashed), avatar, role, streak, XP, refreshToken
- **Topic**: title, slug, description, icon, order, progressWeight
- **Subtopic**: title, slug, topicId, description, order
- **Problem**: title, slug, topicId, subtopicId, difficulty, tags, links, order
- **Progress**: userId, problemId, completed, bookmarked, notes, completedAt

## Future Extensions

The architecture is designed to support:
- Daily streak tracking logic
- XP and achievement system
- Discussion forums
- AI-powered problem recommendations
- Contest tracking
- Real-time collaboration (WebSocket-ready)
- Notes syncing
