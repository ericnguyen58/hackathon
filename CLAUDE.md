# Energy Management System (EMS)

## Project Overview

A web application for homeowners and building operators to monitor, manage, and optimize electricity usage with gamification features.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL + Prisma ORM
- **Styling:** Tailwind CSS + shadcn/ui
- **Charts:** Recharts
- **Auth:** NextAuth.js
- **Testing:** Jest + React Testing Library + Playwright

## Project Structure

```
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── (auth)/            # Auth routes (login, register)
│   │   ├── dashboard/         # Main dashboard
│   │   ├── limits/            # Limit management
│   │   ├── rewards/           # Reward system
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── charts/           # Chart components
│   │   └── forms/            # Form components
│   ├── lib/                   # Utilities
│   ├── server/                # Server-side code
│   │   ├── db/               # Prisma schema & client
│   │   └── actions/          # Server actions
│   └── types/                 # TypeScript types
├── tests/                     # Test files
└── docs/                      # Documentation
```

## Development Principles

1. **TDD First** - Write tests before implementation
2. **80%+ Coverage** - Minimum test coverage requirement
3. **Security First** - No hardcoded secrets, validate all inputs
4. **Immutability** - Never mutate objects, always return new copies
5. **Conventional Commits** - feat/fix/refactor/docs/test/chore/perf/ci

## Key Features

### Dashboard
- Real-time electricity usage display (kWh, cost)
- Interactive charts (daily, weekly, monthly views)
- Comparison with previous periods
- Current limit progress indicator

### Limit Management
- Monthly usage/budget limit configuration
- Usage tracking against limits
- Alert system (in-app, email, push)
- Alert history
- Usage predictions

### Reward System
- Achievement badges (under budget streak, conservation)
- Points for energy savings
- Progress tracking
- Gamification elements

## Database Schema

### Tables
- `User` - Authentication and profile
- `Building` - Building/unit information
- `EnergyReading` - Timestamped usage data
- `MonthlyLimit` - User-configured limits
- `Alert` - Notification history
- `Achievement` - Reward definitions
- `UserAchievement` - User's earned achievements

## Commands

- `/tdd` - Test-driven development workflow
- `/plan` - Implementation planning
- `/code-review` - Code quality review
- `/e2e` - Run E2E tests
