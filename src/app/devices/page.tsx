"use client";

import { useState, useEffect, useTransition } from "react";
import { Device, DeviceCategory } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeviceList } from "@/components/devices/device-list";
import {
  getDevicesForUser,
  toggleDevice,
  createDevice,
  deleteDevice,
} from "@/lib/actions/device-actions";
import { Zap, Power, DollarSign, Plus } from "lucide-react";
import { KWH_RATE } from "@/lib/constants";

const DEMO_USER_ID = "user_1";
const DEMO_BUILDING_ID = "user_1_home";

const h = (n: number) => new Date(Date.now() - n * 3_600_000);
const FALLBACK_DEVICES: Device[] = [
  { id: "dev_1", name: "Central AC",         category: "HVAC",        wattage: 3500, isOn: false, dailyHours: 6,   turnedOnAt: null,   buildingId: DEMO_BUILDING_ID, createdAt: new Date(), updatedAt: new Date() },
  { id: "dev_2", name: "Water Heater",        category: "APPLIANCE",   wattage: 4500, isOn: true,  dailyHours: 2.5, turnedOnAt: h(0.5), buildingId: DEMO_BUILDING_ID, createdAt: new Date(), updatedAt: new Date() },
  { id: "dev_3", name: "Refrigerator",        category: "APPLIANCE",   wattage: 150,  isOn: true,  dailyHours: 22,  turnedOnAt: h(2),   buildingId: DEMO_BUILDING_ID, createdAt: new Date(), updatedAt: new Date() },
  { id: "dev_4", name: "Washer / Dryer",      category: "APPLIANCE",   wattage: 2200, isOn: false, dailyHours: 1,   turnedOnAt: null,   buildingId: DEMO_BUILDING_ID, createdAt: new Date(), updatedAt: new Date() },
  { id: "dev_5", name: "Living Room Lights",  category: "LIGHTING",    wattage: 120,  isOn: true,  dailyHours: 4,   turnedOnAt: h(1),   buildingId: DEMO_BUILDING_ID, createdAt: new Date(), updatedAt: new Date() },
  { id: "dev_6", name: "TV + Entertainment",  category: "ELECTRONICS", wattage: 300,  isOn: false, dailyHours: 3.5, turnedOnAt: null,   buildingId: DEMO_BUILDING_ID, createdAt: new Date(), updatedAt: new Date() },
  { id: "dev_7", name: "Home Office",         category: "ELECTRONICS", wattage: 250,  isOn: true,  dailyHours: 7,   turnedOnAt: h(1.5), buildingId: DEMO_BUILDING_ID, createdAt: new Date(), updatedAt: new Date() },
];

const CATEGORIES: DeviceCategory[] = [
  "HVAC", "APPLIANCE", "LIGHTING", "ELECTRONICS", "EV_CHARGER", "OTHER",
];

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>(FALLBACK_DEVICES);
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "", category: "OTHER" as DeviceCategory, wattage: "", dailyHours: "",
  });

  useEffect(() => {
    getDevicesForUser(DEMO_USER_ID).then((d) => {
      if (d.length > 0) setDevices(d);
    }).catch(() => {});
  }, []);

  const activeCount = devices.filter((d) => d.isOn).length;
  const totalWatts = devices.filter((d) => d.isOn).reduce((s, d) => s + d.wattage, 0);
  const dailyCost = devices.reduce((s, d) => s + (d.wattage / 1000) * d.dailyHours * KWH_RATE, 0);

  function handleToggle(id: string, isOn: boolean) {
    setDevices((prev) => prev.map((d) =>
      d.id === id ? { ...d, isOn, turnedOnAt: isOn ? new Date() : null } : d
    ));
    startTransition(async () => { await toggleDevice(id, isOn).catch(() => {}); });
  }

  function handleDelete(id: string) {
    setDevices((prev) => prev.filter((d) => d.id !== id));
    startTransition(async () => { await deleteDevice(id).catch(() => {}); });
  }

  async function handleAddDevice() {
    if (!form.name || !form.wattage) return;
    const newDevice = await createDevice(DEMO_BUILDING_ID, {
      name: form.name,
      category: form.category,
      wattage: parseFloat(form.wattage),
      dailyHours: parseFloat(form.dailyHours) || 0,
    }).catch(() => null);
    if (newDevice) setDevices((prev) => [...prev, newDevice]);
    setForm({ name: "", category: "OTHER", wattage: "", dailyHours: "" });
    setShowForm(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Remote Control</h1>
              <p className="text-sm text-muted-foreground">Monitor and control your devices</p>
            </div>
            <nav className="flex items-center gap-4">
              <a href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary">Dashboard</a>
              <a href="/limits" className="text-sm font-medium text-muted-foreground hover:text-primary">Limits</a>
              <a href="/rewards" className="text-sm font-medium text-muted-foreground hover:text-primary">Rewards</a>
              <a href="/devices" className="text-sm font-medium text-primary">Devices</a>
              <a href="/insights" className="text-sm font-medium text-muted-foreground hover:text-primary">Insights</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Summary cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full"><Power className="h-5 w-5 text-green-600" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Active Devices</p>
                <p className="text-2xl font-bold">{activeCount} <span className="text-sm font-normal text-muted-foreground">/ {devices.length}</span></p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full"><Zap className="h-5 w-5 text-blue-600" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Current Load</p>
                <p className="text-2xl font-bold">{totalWatts.toLocaleString()}<span className="text-sm font-normal text-muted-foreground"> W</span></p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-full"><DollarSign className="h-5 w-5 text-yellow-600" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Est. Daily Cost</p>
                <p className="text-2xl font-bold">${dailyCost.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Device list */}
        <DeviceList
          devices={devices}
          onToggle={handleToggle}
          onDelete={handleDelete}
          isPending={isPending}
        />

        {/* Add device */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Add Device</CardTitle>
            <Button size="sm" variant="outline" onClick={() => setShowForm(!showForm)}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </CardHeader>
          {showForm && (
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Device Name</label>
                  <input
                    className="mt-1 w-full border rounded px-3 py-2 text-sm bg-background"
                    placeholder="e.g. Bedroom AC"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <select
                    className="mt-1 w-full border rounded px-3 py-2 text-sm bg-background"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as DeviceCategory })}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c.replace("_", " ")}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Wattage (W)</label>
                  <input
                    type="number"
                    className="mt-1 w-full border rounded px-3 py-2 text-sm bg-background"
                    placeholder="e.g. 1500"
                    value={form.wattage}
                    onChange={(e) => setForm({ ...form, wattage: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Daily Hours</label>
                  <input
                    type="number"
                    min={0}
                    max={24}
                    className="mt-1 w-full border rounded px-3 py-2 text-sm bg-background"
                    placeholder="e.g. 4"
                    value={form.dailyHours}
                    onChange={(e) => setForm({ ...form, dailyHours: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleAddDevice} disabled={isPending}>Save Device</Button>
            </CardContent>
          )}
        </Card>
      </main>
    </div>
  );
}
