# AlSafar

A modern Hajj and Umrah package-booking website built with Next.js, TypeScript, and MySQL.

The landing page also includes live location-aware prayer times. The browser asks for location permission, calculates Fajr, Dhuhr, Asr, Maghrib, and Isha locally, and shows the next prayer with a live countdown. If permission is unavailable, it falls back to New Delhi.

## Run it locally

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Run `npm run dev` and open `http://localhost:3000`.

The project works immediately in demo mode when no database is configured. Use:

- Traveler: `traveler@alsafar.com` / `pilgrim123`
- Guide: `guide@alsafar.com` / `guide123`

## Connect MySQL

1. Copy `.env.example` to `.env.local` and update the username/password.
2. Run `mysql -u root -p < database/schema.sql`.
3. Run `npm run db:seed`.
4. Restart `npm run dev`.

`SESSION_SECRET` should be a long random value in production. Login sessions are stored in secure, HTTP-only cookies. Passwords stored in MySQL are hashed with bcrypt.

## Main folders

- `app/` contains pages and server actions.
- `components/` contains reusable interface pieces.
- `lib/` contains authentication, database, package data, and shared types.
- `database/schema.sql` defines the MySQL tables.
- `scripts/seed.ts` creates demo accounts and package rows.
