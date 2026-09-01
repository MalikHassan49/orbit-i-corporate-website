# ORBIT-I Private Limited — Corporate Website & Business Platform

A production-architecture corporate website and client/admin platform for
ORBIT-I Private Limited, built as a fully separated React frontend and
Node.js/Express/MongoDB backend.

```
React (Vite) + TypeScript  →  REST API  →  Node.js + Express + TypeScript  →  MongoDB
```

## Project structure

```
orbit-i/
├── client/          React + TypeScript frontend (Vite, Tailwind v4)
├── server/          Node.js + Express + TypeScript REST API
├── docker/          Dockerfiles + Nginx config
├── docker-compose.yml
└── .env.example     Root reference for Docker Compose
```

See `client/src` and `server/src` for the full internal folder structure
(components/pages/layouts on the frontend; controllers/services/models/
routes on the backend) — each layer has a single responsibility as
described in the project's architecture plan.

## Prerequisites

- Node.js 20+ and npm
- MongoDB 6+ (local install, or use `docker compose up mongodb`)
- Docker + Docker Compose (optional, for containerized runs)

## Local development (without Docker)

**1. Backend**

```bash
cd server
cp .env.example .env      # edit MONGODB_URI / JWT secrets as needed
npm install
npm run dev                # starts on http://localhost:5000
```

Seed the database with demo content (categories, products, services, case
studies, testimonials, open jobs, and an admin account) so the site isn't
empty on first run:

```bash
npm run seed
```

This creates an admin login: **admin@orbit-i.com / OrbitAdmin#2026** — log
in at `/login` and you'll land in the admin dashboard (`/admin/dashboard`).
Change this password immediately in any real deployment.

**2. Frontend**

```bash
cd client
cp .env.example .env      # points VITE_API_BASE_URL at the backend above
npm install
npm run dev                # starts on http://localhost:5173
```

The frontend expects the backend at `http://localhost:5000/api/v1` by
default (see `client/.env.example`).

## Running with Docker Compose

```bash
cp .env.example .env       # set real JWT secrets before doing this in production
docker compose up --build
```

This starts MongoDB, the API server (port 5000), and the client served via
Nginx (port 5173).

## Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `MONGODB_URI` | server | MongoDB connection string |
| `JWT_SECRET` / `JWT_REFRESH_SECRET` | server | Signing secrets for access/refresh tokens — **must** be changed for production |
| `JWT_ACCESS_EXPIRES_IN` / `JWT_REFRESH_EXPIRES_IN` | server | Token lifetimes |
| `CLIENT_URL` | server | Allowed CORS origin + cookie scoping |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | server | Cloudinary credentials for image storage — get these from your Cloudinary dashboard |
| `VITE_API_BASE_URL` | client | Base URL the frontend calls for the API |
| `VITE_SITE_URL` | client | Production domain used for canonical URLs, Open Graph tags, and structured data — set this before launch, and update `client/public/sitemap.xml` and `robots.txt` to match |

Never commit `.env` files — only the `.env.example` templates are tracked.

### Cloudinary setup

Images are stored on Cloudinary (a persistent cloud service) rather than the local filesystem
to ensure they survive deployments and server restarts.

1. Sign up for a free Cloudinary account at https://cloudinary.com/
2. Navigate to your Cloudinary dashboard (Settings > API Keys)
3. Copy `Cloud Name`, `API Key`, and `API Secret`
4. Add these to your `server/.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```
5. Restart the backend — image uploads will now flow through Cloudinary

## Architecture notes

- **Auth**: short-lived JWT access tokens (sent via `Authorization: Bearer`,
  held in memory on the client) + a long-lived refresh token in an
  HTTP-only cookie. Passwords are hashed with bcrypt; role-based
  authorization (`client` / `admin` / `super_admin`) is enforced
  **server-side** on every protected route — frontend route guards are UX
  only, never a security boundary.
- **API responses**: consistent envelope, `{ success, message, data }` for
  success and `{ success: false, message, errors }` for errors, produced
  centrally by the global error-handling middleware.
- **Orders/payments**: the order model intentionally leaves a
  `paymentReference` field open rather than hard-coding a specific gateway,
  so a payment provider can be integrated later without a schema change.
- **Design tokens**: all UI color/typography/spacing values are defined
  once in `client/src/styles/tokens.css`, derived from the ORBIT-I logo,
  and mapped onto Tailwind's theme — components reference tokens, never
  raw hex values.

## Current implementation status

This repository was built in phases. Completed so far:

1. ✅ Foundation — monorepo scaffold, Docker, design tokens, base layout
2. ✅ Backend core — DB connection, User model, auth (register/login/
   refresh/forgot/reset), global error handling
3. ✅ Public website — Home, About, Services, Products, Case Studies,
   Careers, Contact, all wired to the same data shapes the API returns
4. ✅ Client auth + dashboard — register/login, protected routes, client
   dashboard (overview, orders, projects, profile, settings, support,
   invoices)
5. ✅ Order/project system — checkout flow, project + milestone tracking
6. ✅ Admin dashboard — metrics, client/product/order/project/careers/
   leads/case-study/testimonial management
7. ⏳ Polish — the frontend currently renders public-site content (services,
   products, case studies, jobs, testimonials) from local placeholder data
   in `client/src/constants/`; wiring these to the live API endpoints
   (already implemented on the backend) is the next step, along with a
   full accessibility/responsive QA pass and production security hardening
   review.

## License

Proprietary — © ORBIT-I Private Limited. All rights reserved.
