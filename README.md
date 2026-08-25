# Auth API

A secure API built with **Next.js** and **Supabase Auth**, handling user sign up, log in, log out, and route protection via JSON Web Tokens (JWTs). Public routes are open to anyone; protected routes require a valid Bearer token issued by Supabase.

## How it works

1. A client signs up or logs in by sending an email/password to this API.
2. This API forwards those credentials to **Supabase**, which acts as the Identity Provider.
3. On successful login, Supabase returns an **access token (JWT)**.
4. The client attaches that token to future requests in the `Authorization: Bearer <token>` header.
5. Protected routes verify the token with Supabase before returning any data.

## Setup

**1. Clone the repo and install dependencies:**
```bash
git clone https://github.com/sh4dowbl4d3/auth-api
cd auth-api
npm install
```

**2. Create a Supabase project:**
- Go to [supabase.com](https://supabase.com), create a free account, and spin up a new project.
- In your project dashboard, go to **Project Settings → API** and copy your **Project URL** and **anon public key**.

**3. Set up environment variables:**
```bash
cp .env.example .env.local
```
Then open `.env.local` and fill in your real values:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
PORT=3000
```
`.env.local` is gitignored and must never be committed — it holds real credentials.

**4. Run the server:**
```bash
npm run dev
```
The API starts on `http://localhost:3000`. Interactive docs are at `http://localhost:3000/docs`.

## API Reference

| Method | Endpoint                  | Auth Required | Description                              | Success | Error         |
|--------|----------------------------|:--------------:|-------------------------------------------|---------|---------------|
| POST   | `/api/auth/signup`         | No             | Create a new user account                 | 201     | 400           |
| POST   | `/api/auth/login`          | No             | Log in, receive access + refresh tokens   | 200     | 400 / 401     |
| POST   | `/api/auth/logout`         | Yes            | End the current session                   | 204     | 401           |
| GET    | `/api/public/info`         | No             | Public, unprotected data                  | 200     | —             |
| GET    | `/api/protected/profile`   | Yes            | Read the logged-in user's profile         | 200     | 401           |
| GET    | `/api/protected/dashboard` | Yes            | Example second protected route            | 200     | 401           |

**Note:** routes are served under Next.js's `/api` prefix (e.g. `/api/auth/signup` rather than `/auth/signup`), which is the framework's default convention for API routes.

## Authentication flow (example)

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

Token verification logic lives in a single reusable helper, `lib/verifyAuth.js`, rather than being duplicated inside every protected route. Each protected route calls this helper and either receives the verified user or an early `401` response — this is the "middleware" equivalent in this Next.js App Router project, since Express-style middleware isn't used the same way here.

## Swagger UI

Interactive API documentation, including a Bearer token "Authorize" flow, is available at `http://localhost:3000/docs`. Protected endpoints show a lock icon; pasting a valid access token into the Authorize dialog allows testing them directly from the browser.

![Swagger UI screenshot](./screenshot_auth_docs.png)

## Security notes

- Only the Supabase **anon public key** is used — never the `service_role` key, which has elevated privileges and should never be exposed client-side.
- `.env.local` is excluded from version control via `.gitignore`. A `.env.example` with placeholder values is committed instead.
