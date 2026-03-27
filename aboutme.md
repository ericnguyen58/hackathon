# Energy Management System — Project Overview

## The Problem

Has your energy bill just seemed to spike and you never knew why? Or have you been paying more each and every month with no idea what's changed?

Rising energy prices make it more important than ever to understand where your money is going — but most homeowners have no easy way to track their usage in real time. The result: surprise bills, wasted energy, and no clear path to saving.

## The Solution

The Energy Management System (EMS) is a smart home platform designed to live inside your home's energy ecosystem — think Google Home, but built around your electricity.

Once installed, the system automatically detects the major electrical devices in your home through the smart home hub. No manual setup. No guessing. Your AC, water heater, washer, refrigerator, lights — they're all discovered and registered automatically. From there, the EMS tracks your total energy consumption, breaks it down per device, and gives you a complete picture of where every kilowatt-hour is going.

## How It Works

```
Smart Home Hub (e.g. Google Home)
        ↓  auto-detects devices
Energy Management System
        ↓  tracks, aggregates, visualizes
Homeowner Dashboard — anywhere, anytime
```

The hub communicates with each device to report real-time power draw. The EMS ingests that data continuously, stores it, and surfaces it through an intuitive web interface accessible from any device.

## Why It Works

- **Zero setup** — Devices are auto-detected through the smart home ecosystem. No manual entry required.
- **Per-device visibility** — See exactly how much energy your AC, water heater, or home office is consuming — not just a single total number.
- **Remote control** — Turn devices on or off from anywhere, directly from the app.
- **Visual clarity** — Charts make month-to-month changes immediately obvious. It's not just numbers on a spreadsheet; you can *see* the trend.
- **Customizable limits** — Every homeowner is different. Set your own budget limit that works for your lifestyle. The energy company sets a baseline, and you fine-tune from there.
- **Proactive alerts** — Get notified when you're consuming more than expected, before it hits your bill. Thresholds are fully configurable.
- **Gamification** — Earn points, maintain streaks, and unlock achievement badges for staying under budget and reducing consumption.

## Who It's For

Homeowners and building operators who want to:
- Understand exactly what's driving their energy bill
- Control their devices remotely without being home
- Stay within a monthly energy budget
- Build better long-term energy habits

## Key Features

| Feature | Description |
|---|---|
| Auto Device Detection | Smart home hub discovers all major devices automatically |
| Real-time Dashboard | View current kWh usage and estimated cost at a glance |
| Per-Device Insights | See estimated monthly kWh and cost broken down by device and category |
| Remote Control | Toggle any device on or off from anywhere |
| Interactive Charts | Daily, weekly, and monthly usage visualizations |
| Custom Limits | Set your own monthly usage or budget cap |
| Smart Alerts | Notifications at configurable thresholds (e.g. 80% of limit) |
| Reward System | Earn badges and points for staying under budget |

## Under the Hood — What the Code Does

The EMS is built as a full-stack web application using **Next.js 16** with the App Router, written in **TypeScript**.

- **Frontend** — React-based UI styled with Tailwind CSS and shadcn/ui. Charts use Recharts for interactive visualizations.
- **Backend** — Next.js server actions handle all business logic server-side. No sensitive logic runs on the client.
- **Database** — PostgreSQL (Neon) stores all user, building, device, energy reading, limit, alert, and achievement data. Prisma ORM manages schema and type-safe queries.
- **Device Layer** — In production, the smart home hub pushes device readings to the EMS API. The current demo simulates this with pre-populated device data.
- **Pages** — Five core sections: **Dashboard** (live overview), **Limits** (budget management), **Rewards** (gamification), **Devices** (remote control), and **Insights** (per-device energy breakdown).

## The Bottom Line

Energy costs are rising. Most homeowners have no idea which devices are driving their bill. The EMS plugs into the smart home ecosystem already in your house, automatically maps your devices, and gives you the visibility and control to actually do something about it.
