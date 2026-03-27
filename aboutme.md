# Energy Management System — Project Overview

## The Problem

Has your energy bill just seemed to spike and you never knew why? Or have you been paying more each and every month with no idea what's changed?

Rising energy prices make it more important than ever to understand where your money is going — but most homeowners have no easy way to track their usage in real time. The result: surprise bills, wasted energy, and no clear path to saving.

## The Solution

We built an Energy Management System (EMS) for homeowners who want to take control of their electricity usage — accessible anytime, anywhere.

The EMS tracks your current energy consumption, plots it visually on interactive charts, and alerts you when you're approaching or exceeding your monthly limit. No more guessing. No more surprises.

## Why It Works

- **Visual clarity** — Charts make month-to-month changes immediately obvious. It's not just numbers on a spreadsheet; you can *see* the trend.
- **Customizable limits** — Every homeowner is different. Set your own budget limit that works for your lifestyle. The energy company sets a baseline "status quo" limit, and you can fine-tune from there.
- **Proactive alerts** — Get notified when you're consuming more than expected, before it hits your bill. Alert thresholds are fully configurable.
- **Always accessible** — Check your usage from any device, at any time. Your data is always up to date.
- **Adapt over time** — As your habits and energy needs evolve, so can your limits. The EMS grows with you.

## Who It's For

Homeowners and building operators who want to:
- Stay within a monthly energy budget
- Understand how their usage changes over time
- Be alerted before they overspend
- Make informed decisions about their energy habits

## Key Features

| Feature | Description |
|---|---|
| Real-time Dashboard | View current kWh usage and estimated cost at a glance |
| Interactive Charts | Daily, weekly, and monthly usage visualizations |
| Custom Limits | Set your own monthly usage or budget cap |
| Smart Alerts | Notifications at configurable thresholds (e.g. 80% of limit) |
| Reward System | Earn badges and points for staying under budget |
| Period Comparison | See how this month stacks up against the last |

## Under the Hood — What the Code Does

The EMS is built as a full-stack web application using **Next.js 15** with the App Router, written in **TypeScript**.

- **Frontend** — React-based UI styled with Tailwind CSS and shadcn/ui component library. Charts are rendered using Recharts, giving users interactive, animated visualizations of their energy data.
- **Backend** — Next.js server actions handle all business logic server-side, keeping sensitive operations off the client. API routes expose data endpoints for real-time consumption updates.
- **Database** — PostgreSQL stores all user, building, energy reading, limit, alert, and achievement data. Prisma ORM manages schema definitions and type-safe database queries.
- **Authentication** — NextAuth.js handles user sessions and login flows securely.
- **Pages & Routing** — Three core sections: the **Dashboard** (live usage overview and charts), **Limits** (set and manage monthly caps and alert thresholds), and **Rewards** (achievements and points earned for staying under budget).
- **Alerts** — The system monitors usage against configured limits and triggers notifications when users hit defined thresholds — no manual checking required.

## The Bottom Line

Energy costs are rising. Habits matter. The EMS gives homeowners the visibility and control they need to adapt — and save.
