This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Running Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env` file in the root of the project:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/ems_dev"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

> You'll need a local PostgreSQL instance running, or swap `DATABASE_URL` for a free [Neon](https://neon.tech) connection string.

### 3. Generate the Prisma client

```bash
npm run db:generate
```

### 4. Run database migrations

```bash
npm run db:migrate
```

### 5. Seed the database (optional — loads demo data)

```bash
npm run db:seed
```

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with demo data |

## Deploy on Vercel

This app uses **Neon** (free PostgreSQL) as the production database. Vercel has a built-in Neon integration that sets `DATABASE_URL` automatically.

### 1. Create a Neon database via Vercel

1. Go to your Vercel project → **Storage** tab
2. Click **Create Database** → select **Neon Postgres**
3. Follow the prompts — Vercel will auto-add `DATABASE_URL` to your environment variables

### 2. Set remaining environment variables in Vercel

| Variable | Value |
|---|---|
| `NEXTAUTH_SECRET` | a long random string (run `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | your Vercel deployment URL (e.g. `https://your-app.vercel.app`) |

### 3. Deploy

Push to your connected Git branch. Vercel will run `prisma generate && next build` automatically.
