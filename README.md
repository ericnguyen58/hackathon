This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Running Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env` file in the root of the project:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

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

The easiest way to deploy is via the [Vercel Platform](https://vercel.com/new). Make sure to set the environment variables in your Vercel project settings.
