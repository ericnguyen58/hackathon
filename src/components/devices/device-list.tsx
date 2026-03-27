"use client";

import { Device, DeviceCategory } from "@prisma/client";
import { DeviceCard } from "./device-card";

const CATEGORY_ORDER: DeviceCategory[] = [
  "HVAC", "APPLIANCE", "LIGHTING", "ELECTRONICS", "EV_CHARGER", "OTHER",
];

interface DeviceListProps {
  devices: Device[];
  onToggle: (id: string, isOn: boolean) => void;
  onDelete: (id: string) => void;
  isPending: boolean;
}

export function DeviceList({ devices, onToggle, onDelete, isPending }: DeviceListProps) {
  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const items = devices.filter((d) => d.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {} as Record<DeviceCategory, Device[]>);

  if (devices.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-12">
        No devices added yet. Add your first device below.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {(Object.entries(grouped) as [DeviceCategory, Device[]][]).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">
            {category.replace("_", " ")}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                onToggle={onToggle}
                onDelete={onDelete}
                isPending={isPending}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
