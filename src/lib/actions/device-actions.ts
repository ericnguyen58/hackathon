"use server";

import { prisma } from "@/lib/db";
import { DeviceCategory } from "@prisma/client";
import { KWH_RATE } from "@/lib/constants";

export async function getDevicesForUser(userId: string) {
  const buildings = await prisma.building.findMany({
    where: { userId },
    include: { devices: { orderBy: [{ category: "asc" }, { name: "asc" }] } },
  });
  return buildings.flatMap((b) => b.devices);
}

export async function toggleDevice(deviceId: string, isOn: boolean) {
  return prisma.device.update({
    where: { id: deviceId },
    data: { isOn, updatedAt: new Date() },
  });
}

export async function updateDeviceHours(deviceId: string, dailyHours: number) {
  return prisma.device.update({
    where: { id: deviceId },
    data: { dailyHours, updatedAt: new Date() },
  });
}

export async function createDevice(
  buildingId: string,
  data: { name: string; category: DeviceCategory; wattage: number; dailyHours: number }
) {
  return prisma.device.create({ data: { ...data, buildingId } });
}

export async function deleteDevice(deviceId: string) {
  return prisma.device.delete({ where: { id: deviceId } });
}

export async function getEnergyInsights(userId: string) {
  const devices = await getDevicesForUser(userId);

  const withStats = devices.map((d) => {
    const dailyKwh = (d.wattage / 1000) * d.dailyHours;
    const monthlyKwh = dailyKwh * 30;
    const monthlyCost = monthlyKwh * KWH_RATE;
    return { ...d, dailyKwh, monthlyKwh, monthlyCost };
  });

  const categoryMap = new Map<
    DeviceCategory,
    { monthlyKwh: number; monthlyCost: number; deviceCount: number }
  >();

  for (const d of withStats) {
    const existing = categoryMap.get(d.category) ?? { monthlyKwh: 0, monthlyCost: 0, deviceCount: 0 };
    categoryMap.set(d.category, {
      monthlyKwh: existing.monthlyKwh + d.monthlyKwh,
      monthlyCost: existing.monthlyCost + d.monthlyCost,
      deviceCount: existing.deviceCount + 1,
    });
  }

  const byCategory = Array.from(categoryMap.entries()).map(([category, stats]) => ({
    category,
    ...stats,
  }));

  const totals = withStats.reduce(
    (acc, d) => ({
      dailyKwh: acc.dailyKwh + d.dailyKwh,
      monthlyKwh: acc.monthlyKwh + d.monthlyKwh,
      monthlyCost: acc.monthlyCost + d.monthlyCost,
    }),
    { dailyKwh: 0, monthlyKwh: 0, monthlyCost: 0 }
  );

  return { devices: withStats, byCategory, totals };
}
