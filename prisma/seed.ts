import "dotenv/config";
import { PrismaClient, UserRole, AchievementCategory, AlertType, AlertSeverity } from "@prisma/client";

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  console.log("Seeding database...");

  // Create achievements
  const achievements = await Promise.all([
    prisma.achievement.create({
      data: {
        name: "First Step",
        description: "Log your first energy reading",
        icon: "footprints",
        points: 10,
        category: AchievementCategory.MILESTONE,
        requirement: JSON.stringify({ type: "first_reading" }),
      },
    }),
    prisma.achievement.create({
      data: {
        name: "Week Warrior",
        description: "Stay under budget for 7 consecutive days",
        icon: "calendar-check",
        points: 50,
        category: AchievementCategory.STREAK,
        requirement: JSON.stringify({ type: "streak_days", days: 7 }),
      },
    }),
    prisma.achievement.create({
      data: {
        name: "Month Master",
        description: "Stay under budget for a full month",
        icon: "trophy",
        points: 100,
        category: AchievementCategory.SAVINGS,
        requirement: JSON.stringify({ type: "under_budget_month" }),
      },
    }),
    prisma.achievement.create({
      data: {
        name: "Eco Warrior",
        description: "Reduce usage by 20% from last month",
        icon: "leaf",
        points: 75,
        category: AchievementCategory.CONSERVATION,
        requirement: JSON.stringify({ type: "reduction_percentage", percent: 20 }),
      },
    }),
    prisma.achievement.create({
      data: {
        name: "Limit Setter",
        description: "Set your first monthly limit",
        icon: "target",
        points: 15,
        category: AchievementCategory.MILESTONE,
        requirement: JSON.stringify({ type: "first_limit" }),
      },
    }),
  ]);

  console.log(`Created ${achievements.length} achievements`);

  // Create a demo user
  const user = await prisma.user.create({
    data: {
      email: "demo@example.com",
      name: "Demo User",
      password: "$2a$10$YourHashedPasswordHere", // bcrypt hash of "password"
      role: UserRole.HOMEOWNER,
      points: 85,
      streakDays: 5,
    },
  });

  console.log(`Created user: ${user.email}`);

  // Create a building for the user
  const building = await prisma.building.create({
    data: {
      name: "My Home",
      address: "123 Energy Street",
      userId: user.id,
    },
  });

  console.log(`Created building: ${building.name}`);

  // Generate sample energy readings (last 30 days)
  const now = new Date();
  const readings = [];

  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(12, 0, 0, 0);

    // Random daily usage between 15-35 kWh
    const dailyKwh = 15 + Math.random() * 20;
    const cost = dailyKwh * 0.15; // $0.15 per kWh

    readings.push({
      timestamp: date,
      kWh: Math.round(dailyKwh * 100) / 100,
      cost: Math.round(cost * 100) / 100,
      buildingId: building.id,
    });
  }

  await prisma.energyReading.createMany({ data: readings });
  console.log(`Created ${readings.length} energy readings`);

  // Create monthly limit for current month
  const now_date = new Date();
  const limit = await prisma.monthlyLimit.create({
    data: {
      year: now_date.getFullYear(),
      month: now_date.getMonth() + 1,
      kWhLimit: 800,
      costLimit: 120,
      alertThreshold: 80,
      userId: user.id,
    },
  });

  console.log(`Created monthly limit: ${limit.kWhLimit} kWh`);

  // Award some achievements to user
  await prisma.userAchievement.create({
    data: {
      userId: user.id,
      achievementId: achievements[0].id, // First Step
    },
  });

  await prisma.userAchievement.create({
    data: {
      userId: user.id,
      achievementId: achievements[4].id, // Limit Setter
    },
  });

  console.log("Awarded achievements to user");

  // Create sample alerts
  const alerts = await prisma.alert.createMany({
    data: [
      {
        type: AlertType.LIMIT_APPROACHING,
        message: "You're at 78% of your monthly kWh limit",
        severity: AlertSeverity.WARNING,
        userId: user.id,
        limitId: limit.id,
      },
      {
        type: AlertType.ACHIEVEMENT_EARNED,
        message: "You earned the 'First Step' achievement!",
        severity: AlertSeverity.INFO,
        userId: user.id,
      },
      {
        type: AlertType.DAILY_SUMMARY,
        message: "Yesterday's usage: 22.4 kWh ($3.36)",
        severity: AlertSeverity.INFO,
        userId: user.id,
      },
    ],
  });

  console.log(`Created ${alerts.count} alerts`);
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
