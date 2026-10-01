# Auth API

An authentication API built with Next.js and Supabase Auth. It handles user signup, login, logout, and route protection using JSON Web Tokens (JWTs). Public routes are open to anyone; protected routes require a Bearer token issued by Supabase.

## How it works

1. The client sends an email and password to the signup or login endpoint.
2. The API forwards those credentials to Supabase, which acts as the identity provider.
3. On successful authentication, Supabase returns a JWT access token.
4. The client includes that token in the `Authorization: Bearer <token>` header on future requests.
5. Protected routes verify the token against Supabase before returning data.

## Setup

### 1. Clone the repository and install dependencies

```bash
git clone https://github.com/sh4dowbl4d3/auth-api
cd auth-api
npm install
```

### 2. Create a Supabase project

1. Create an account and a new project at [supabase.com](https://supabase.com).
2. Go to Project Settings > API, then copy the Project URL and anon public key.

### 3. Set up environment variables

Copy the example environment file:
```bash
cp .env.example .env.local
```

Populate `.env.local` with your project credentials:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
PORT=3000
```
`.env.local` is ignored by git so credentials stay private.

### 4. Run the server

```bash
npm run dev
```
The API starts on `http://localhost:3000`. Interactive documentation runs at `http://localhost:3000/docs`.

## API reference

| Method | Endpoint | Auth required | Description | Success | Error |
|--------|----------------------------|:-------------:|-------------------------------------------|---------|-------|
| POST | `/api/auth/signup` | No | Create a new user account | 201 | 400 |
| POST | `/api/auth/login` | No | Log in, receive access + refresh tokens | 200 | 400 / 401 |
| POST | `/api/auth/logout` | Yes | End the current session | 204 | 401 |
| GET | `/api/public/info` | No | Public, unprotected data | 200 | None |
| GET | `/api/protected/profile` | Yes | Read the logged-in user's profile | 200 | 401 |
| GET | `/api/protected/dashboard` | Yes | Example second protected route | 200 | 401 |

Routes follow Next.js App Router conventions and are served under the `/api` prefix.

## Authentication flow example

```bash
# 1. Sign up
curl -i -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 2. Log in
curl -i -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
# → returns { "access_token": "...", "refresh_token": "..." }

# 3. Access a protected route
curl -i http://localhost:3000/api/protected/profile \
  -H "Authorization: Bearer <paste_access_token_here>"
```

## Architecture

Token verification logic is centralized in `lib/verifyAuth.js`. Each protected route handler calls this helper to validate the bearer token with Supabase and returns a 401 response if verification fails.

## Swagger UI

Interactive documentation is available at `http://localhost:3000/docs`. Protected endpoints include a lock icon and can be tested directly from the browser by pasting an access token into the Authorize modal.

![Swagger UI screenshot](./screenshot_auth_docs.png)

## Security notes

- The API only requires the Supabase anon public key. The privileged `service_role` key is not used.
- `.env.local` is listed in `.gitignore` to prevent committing secrets. Use `.env.example` as a template for required keys.
