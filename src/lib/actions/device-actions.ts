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
  if (isOn) {
    return prisma.device.update({
      where: { id: deviceId },
      data: { isOn: true, turnedOnAt: new Date(), updatedAt: new Date() },
    });
  }

  // Turning off — calculate elapsed hours and accumulate into dailyHours
  const device = await prisma.device.findUnique({ where: { id: deviceId } });
  const elapsed = device?.turnedOnAt
    ? (Date.now() - device.turnedOnAt.getTime()) / 3_600_000
    : 0;

  return prisma.device.update({
    where: { id: deviceId },
    data: {
      isOn: false,
      turnedOnAt: null,
      dailyHours: Math.min(24, (device?.dailyHours ?? 0) + elapsed),
      updatedAt: new Date(),
    },
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

const now = () => new Date();
const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000);

const FALLBACK_DEVICES = [
  { id: "dev_1", name: "Central AC",         category: "HVAC"        as DeviceCategory, wattage: 3500, isOn: false, dailyHours: 6,   turnedOnAt: null,           buildingId: "user_1_home", createdAt: now(), updatedAt: now() },
  { id: "dev_2", name: "Water Heater",        category: "APPLIANCE"   as DeviceCategory, wattage: 4500, isOn: true,  dailyHours: 2.5, turnedOnAt: hoursAgo(0.5),  buildingId: "user_1_home", createdAt: now(), updatedAt: now() },
  { id: "dev_3", name: "Refrigerator",        category: "APPLIANCE"   as DeviceCategory, wattage: 150,  isOn: true,  dailyHours: 22,  turnedOnAt: hoursAgo(2),    buildingId: "user_1_home", createdAt: now(), updatedAt: now() },
  { id: "dev_4", name: "Washer / Dryer",      category: "APPLIANCE"   as DeviceCategory, wattage: 2200, isOn: false, dailyHours: 1,   turnedOnAt: null,           buildingId: "user_1_home", createdAt: now(), updatedAt: now() },
  { id: "dev_5", name: "Living Room Lights",  category: "LIGHTING"    as DeviceCategory, wattage: 120,  isOn: true,  dailyHours: 4,   turnedOnAt: hoursAgo(1),    buildingId: "user_1_home", createdAt: now(), updatedAt: now() },
  { id: "dev_6", name: "TV + Entertainment",  category: "ELECTRONICS" as DeviceCategory, wattage: 300,  isOn: false, dailyHours: 3.5, turnedOnAt: null,           buildingId: "user_1_home", createdAt: now(), updatedAt: now() },
  { id: "dev_7", name: "Home Office",         category: "ELECTRONICS" as DeviceCategory, wattage: 250,  isOn: true,  dailyHours: 7,   turnedOnAt: hoursAgo(1.5),  buildingId: "user_1_home", createdAt: now(), updatedAt: now() },
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
