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

const FALLBACK_DEVICES = [
  { id: "dev_1", name: "Central AC",          category: "HVAC"        as DeviceCategory, wattage: 3500, isOn: false, dailyHours: 6,  buildingId: "user_1_home", createdAt: new Date(), updatedAt: new Date() },
  { id: "dev_2", name: "Water Heater",         category: "APPLIANCE"   as DeviceCategory, wattage: 4500, isOn: true,  dailyHours: 3,  buildingId: "user_1_home", createdAt: new Date(), updatedAt: new Date() },
  { id: "dev_3", name: "Refrigerator",         category: "APPLIANCE"   as DeviceCategory, wattage: 150,  isOn: true,  dailyHours: 24, buildingId: "user_1_home", createdAt: new Date(), updatedAt: new Date() },
  { id: "dev_4", name: "Washer / Dryer",       category: "APPLIANCE"   as DeviceCategory, wattage: 2200, isOn: false, dailyHours: 1,  buildingId: "user_1_home", createdAt: new Date(), updatedAt: new Date() },
  { id: "dev_5", name: "Living Room Lights",   category: "LIGHTING"    as DeviceCategory, wattage: 120,  isOn: true,  dailyHours: 5,  buildingId: "user_1_home", createdAt: new Date(), updatedAt: new Date() },
  { id: "dev_6", name: "TV + Entertainment",   category: "ELECTRONICS" as DeviceCategory, wattage: 300,  isOn: false, dailyHours: 4,  buildingId: "user_1_home", createdAt: new Date(), updatedAt: new Date() },
  { id: "dev_7", name: "Home Office",          category: "ELECTRONICS" as DeviceCategory, wattage: 250,  isOn: true,  dailyHours: 8,  buildingId: "user_1_home", createdAt: new Date(), updatedAt: new Date() },
];

export async function getEnergyInsights(userId: string) {
  let devices = await getDevicesForUser(userId).catch(() => []);
  if (devices.length === 0) devices = FALLBACK_DEVICES;

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
