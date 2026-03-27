"use server";

import { prisma } from "@/lib/db";
import { startOfMonth, endOfMonth, subDays, format } from "date-fns";

export async function getDashboardData(userId: string) {
  const now = new Date();
  const thirtyDaysAgo = subDays(now, 30);
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  // Get user's buildings
  const buildings = await prisma.building.findMany({
    where: { userId },
    include: {
      readings: {
        where: {
          timestamp: {
            gte: thirtyDaysAgo,
          },
        },
        orderBy: {
          timestamp: "asc",
        },
      },
    },
  });

  // Get current month's limit
  const currentLimit = await prisma.monthlyLimit.findUnique({
    where: {
      userId_year_month: {
        userId,
        year: now.getFullYear(),
        month: now.getMonth() + 1,
      },
    },
  });

  // Get unread alerts count
  const unreadAlerts = await prisma.alert.count({
    where: {
      userId,
      isRead: false,
    },
  });

  // Get user stats
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      achievements: {
        include: {
          achievement: true,
        },
      },
    },
  });

  // Calculate monthly usage
  const monthlyReadings = await prisma.energyReading.findMany({
    where: {
      building: {
        userId,
      },
      timestamp: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
  });

  const monthlyKwh = monthlyReadings.reduce((sum, r) => sum + r.kWh, 0);
  const monthlyCost = monthlyReadings.reduce((sum, r) => sum + (r.cost || 0), 0);

  // Daily data for chart (last 7 days)
  const dailyData = [];
  for (let i = 6; i >= 0; i--) {
    const date = subDays(now, i);
    const dayReadings = await prisma.energyReading.findMany({
      where: {
        building: { userId },
        timestamp: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lt: new Date(date.setHours(23, 59, 59, 999)),
        },
      },
    });
    const dayKwh = dayReadings.reduce((sum, r) => sum + r.kWh, 0);
    dailyData.push({
      date: format(date, "MMM dd"),
      kWh: Math.round(dayKwh * 100) / 100,
      cost: Math.round(dayReadings.reduce((sum, r) => sum + (r.cost || 0), 0) * 100) / 100,
    });
  }

  return {
    buildings,
    currentLimit,
    monthlyUsage: {
      kWh: Math.round(monthlyKwh * 100) / 100,
      cost: Math.round(monthlyCost * 100) / 100,
    },
    dailyData,
    unreadAlerts,
    user,
  };
}

export async function getRecentAlerts(userId: string, limit: number = 5) {
  return prisma.alert.findMany({
    where: { userId },
    orderBy: { sentAt: "desc" },
    take: limit,
  });
}

export async function markAlertAsRead(alertId: string) {
  return prisma.alert.update({
    where: { id: alertId },
    data: { isRead: true },
  });
}

export async function getLimitHistory(userId: string) {
  return prisma.monthlyLimit.findMany({
    where: { userId },
    orderBy: [{ year: "desc" }, { month: "desc" }],
    take: 12,
  });
}

export async function upsertMonthlyLimit(
  userId: string,
  data: {
    year: number;
    month: number;
    kWhLimit?: number;
    costLimit?: number;
    alertThreshold: number;
  }
) {
  const limit = await prisma.monthlyLimit.upsert({
    where: { userId_year_month: { userId, year: data.year, month: data.month } },
    update: {
      kWhLimit: data.kWhLimit,
      costLimit: data.costLimit,
      alertThreshold: data.alertThreshold,
    },
    create: {
      userId,
      year: data.year,
      month: data.month,
      kWhLimit: data.kWhLimit,
      costLimit: data.costLimit,
      alertThreshold: data.alertThreshold,
    },
  });
  return limit;
}

export async function getAllAchievements(userId: string) {
  const [all, earned] = await Promise.all([
    prisma.achievement.findMany({ orderBy: { points: "desc" } }),
    prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
    }),
  ]);
  return { all, earned };
}

export async function getEnergyHistory(
  userId: string,
  days: number = 30
) {
  const startDate = subDays(new Date(), days);

  const readings = await prisma.energyReading.findMany({
    where: {
      building: { userId },
      timestamp: { gte: startDate },
    },
    orderBy: { timestamp: "asc" },
    include: { building: true },
  });

  // Group by day
  const grouped = readings.reduce((acc, reading) => {
    const date = format(reading.timestamp, "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = { date, kWh: 0, cost: 0 };
    }
    acc[date].kWh += reading.kWh;
    acc[date].cost += reading.cost || 0;
    return acc;
  }, {} as Record<string, { date: string; kWh: number; cost: number }>);

  return Object.values(grouped).map((d) => ({
    ...d,
    kWh: Math.round(d.kWh * 100) / 100,
    cost: Math.round(d.cost * 100) / 100,
  }));
}
