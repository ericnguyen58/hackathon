# Energy Management System (EMS)

A web app for homeowners to monitor electricity usage, set budget limits, and earn rewards for saving energy.

**Live:** https://hackathon-o0hinb7by-ericnguyen58s-projects.vercel.app

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL (Neon) |
| ORM | Prisma 7.6 |
| DB Adapter | `@prisma/adapter-pg` |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Charts | Recharts |
| Auth | NextAuth.js (configured, demo uses hardcoded user) |
| Icons | Lucide React |
| Validation | Zod |
| Hosting | Vercel |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Root — redirects to /dashboard
│   ├── dashboard/page.tsx        # Main dashboard (server component, force-dynamic)
│   ├── limits/page.tsx           # Limit management (client component)
│   └── rewards/page.tsx          # Achievements & points (client component)
├── components/
│   ├── dashboard/
│   │   ├── stats-cards.tsx       # 4-card usage/cost overview
│   │   ├── usage-chart.tsx       # Recharts area chart (kWh or cost)
│   │   ├── limit-progress.tsx    # Progress bar toward monthly limit
│   │   ├── recent-alerts.tsx     # Last 5 alerts with severity badges
│   │   └── achievements.tsx      # Points, streak, earned achievements
│   └── ui/                       # shadcn/ui primitives (button, card, badge, etc.)
├── lib/
│   ├── db.ts                     # Prisma client singleton + type exports
│   ├── utils.ts                  # cn() Tailwind class merger
│   └── actions/
│       └── energy-actions.ts     # All server actions (DB queries)
prisma/
├── schema.prisma                 # Database schema
├── migrations/                   # SQL migration files
├── seed.ts                       # Demo data seed script
prisma.config.ts                  # Prisma CLI config (URLs, migration path)
```

---

## Database Schema

```
User
 ├── id, email, name, password, role, points, streakDays
 ├── → Building (one-to-many)
 ├── → MonthlyLimit (one-to-many)
 ├── → Alert (one-to-many)
 └── → UserAchievement (one-to-many)

Building
 ├── id, name, address, timezone, userId
 └── → EnergyReading (one-to-many)

EnergyReading
 └── id, timestamp, kWh, cost, source, buildingId

MonthlyLimit
 ├── id, year, month, kWhLimit, costLimit, alertThreshold, isActive, userId
 └── → Alert (one-to-many)

Alert
 └── id, type, message, severity, isRead, sentAt, userId, limitId

Achievement
 ├── id, name, description, icon, points, requirement (JSON), category
 └── → UserAchievement (one-to-many)

UserAchievement
 └── id, userId, achievementId, earnedAt, progress
```

**Enums:**
- `UserRole`: HOMEOWNER, BUILDING_OPERATOR, ADMIN
- `AlertType`: LIMIT_APPROACHING, LIMIT_EXCEEDED, USAGE_SPIKE, DAILY_SUMMARY, WEEKLY_SUMMARY, ACHIEVEMENT_EARNED
- `AlertSeverity`: INFO, WARNING, CRITICAL
- `AchievementCategory`: SAVINGS, STREAK, CONSERVATION, MILESTONE, SPECIAL

---

## Pages

### `/dashboard` — Server Component (force-dynamic)
Fetches fresh data on every request. Queries:
- User profile + earned achievements
- Buildings + energy readings from last 30 days
- Current month's limit
- 7-day daily kWh/cost breakdown
- Unread alert count

Renders: stats cards, usage chart (kWh/cost toggle), limit progress bars, recent alerts sidebar, achievements sidebar.

> **Note:** Currently uses hardcoded `DEMO_USER_ID = "user_1"`. In production this would come from the auth session.

### `/limits` — Client Component
Interactive form to set monthly limits. Fetches current limit and history via server actions on mount.

- Set kWh limit and/or cost limit (at least one required)
- Configurable alert threshold (50–95%)
- Shows current month progress bars
- Shows last 12 months of limit history

### `/rewards` — Client Component
Fetches all achievements and user's earned achievements on mount.

- Total points and day streak stats
- Overall completion progress bar
- Earned achievements grid (colored by category)
- Locked achievements grid (grayed out)

---

## Server Actions (`src/lib/actions/energy-actions.ts`)

All marked `"use server"` — run only on the server, never exposed to the client.

| Function | Description |
|---|---|
| `getDashboardData(userId)` | Full dashboard data aggregation |
| `getRecentAlerts(userId, limit)` | Fetch latest N alerts |
| `markAlertAsRead(alertId)` | Mark a single alert as read |
| `getLimitHistory(userId)` | Last 12 months of limits |
| `upsertMonthlyLimit(userId, data)` | Create or update current month's limit |
| `getAllAchievements(userId)` | All achievements + which ones user has earned |
| `getEnergyHistory(userId, days)` | Daily kWh/cost aggregates for past N days |

---

## Database Client (`src/lib/db.ts`)

Uses a singleton pattern to avoid creating multiple Prisma instances during Next.js hot reload in dev:

```ts
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
export const prisma = globalForPrisma.prisma ?? createPrisma();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

Connects via `@prisma/adapter-pg` using `DATABASE_URL` from environment.

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server at localhost:3000 |
| `npm run build` | Generate Prisma client + build for production |
| `npm run start` | Start production server |
| `npm run db:generate` | Regenerate Prisma Client types from schema |
| `npm run db:migrate` | Run new migrations (dev only, requires direct DB access) |
| `npm run db:seed` | Insert demo data into the database |

---

## Running Locally

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Create a `.env` file:
```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://user:password@host/dbname?sslmode=require
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
```
Use your Neon connection strings (pooled for `DATABASE_URL`, unpooled for `DATABASE_URL_UNPOOLED`).

### 3. Generate Prisma client
```bash
npm run db:generate
```

### 4. Start the dev server
```bash
npm run dev
```

Open http://localhost:3000.

> **Migrations:** `npm run db:migrate` requires a direct TCP connection to port 5432. If your network blocks this, run migration SQL manually in the Neon SQL Editor.

> **Seed data:** `npm run db:seed` also requires direct DB access. If blocked, paste the seed SQL from `prisma/seed.ts` into the Neon SQL Editor manually.

---

## Deploying to Vercel

### 1. Create a Neon database
Go to Vercel → Storage → Create Database → Neon Postgres. Vercel auto-adds `DATABASE_URL` and `DATABASE_URL_UNPOOLED` to your environment.

### 2. Set additional environment variables in Vercel
| Variable | Value |
|---|---|
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your Vercel deployment URL |

### 3. Initialize the database
Since `prisma migrate deploy` requires a direct TCP connection (not available during Vercel build), run the migration SQL manually in the Neon SQL Editor once. The file is at `prisma/migrations/0001_init/migration.sql`.

Then seed demo data via the Neon SQL Editor (see the INSERT statements in `prisma/seed.ts`).

### 4. Push to GitHub
Vercel auto-deploys on push. The build command is:
```bash
prisma generate && next build
```
