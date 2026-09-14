# Wayfarer — Travel Planner

A modern web app for planning trips with friends — create a trip, invite the group, and organize everything (itinerary, bucket list, flights, packing, places to stay, expenses, notes) in one place.

Built with Next.js (App Router), TypeScript, Tailwind CSS, and Prisma with SQLite.

## Getting Started

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app. The seed script creates a few demo trips (with travelers, flights, an itinerary, expenses, and more) so there's something to look at right away.

## Data & persistence

Trips and everything inside them are stored in a local SQLite database (`prisma/dev.db`), managed with Prisma. There's no separate backend service to run — Next.js Server Actions read and write the database directly.

There's no password-based login. The first time someone creates a trip or joins one via a share link, they're asked for their name once; that becomes a `User` row tied to a browser cookie, so they're recognized on future visits. Sharing a trip (via the Share button on any trip page) generates an editor link and a viewer link that add the person who opens them as a real traveler on that trip.

## Useful scripts

```bash
npm run dev         # start the dev server
npm run build       # production build
npm run lint        # lint the project
npx prisma studio   # browse/edit the database in a GUI
npx prisma db seed  # reset to the demo data
```
