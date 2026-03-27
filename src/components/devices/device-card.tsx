"use client";

import { useEffect, useState } from "react";
import { Device, DeviceCategory } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Thermometer, Lightbulb, WashingMachine, Monitor, Car, Plug, Trash2 } from "lucide-react";

const CATEGORY_ICON: Record<DeviceCategory, React.ReactNode> = {
  HVAC:        <Thermometer className="h-5 w-5" />,
  LIGHTING:    <Lightbulb className="h-5 w-5" />,
  APPLIANCE:   <WashingMachine className="h-5 w-5" />,
  ELECTRONICS: <Monitor className="h-5 w-5" />,
  EV_CHARGER:  <Car className="h-5 w-5" />,
  OTHER:       <Plug className="h-5 w-5" />,
};

const CATEGORY_COLOR: Record<DeviceCategory, string> = {
  HVAC:        "bg-blue-100 text-blue-800",
  LIGHTING:    "bg-yellow-100 text-yellow-800",
  APPLIANCE:   "bg-purple-100 text-purple-800",
  ELECTRONICS: "bg-indigo-100 text-indigo-800",
  EV_CHARGER:  "bg-green-100 text-green-800",
  OTHER:       "bg-gray-100 text-gray-800",
};

function formatElapsed(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

interface DeviceCardProps {
  device: Device;
  onToggle: (id: string, isOn: boolean) => void;
  onDelete: (id: string) => void;
  isPending: boolean;
}

export function DeviceCard({ device, onToggle, onDelete, isPending }: DeviceCardProps) {
  const [elapsedMs, setElapsedMs] = useState(
    device.isOn && device.turnedOnAt ? Date.now() - new Date(device.turnedOnAt).getTime() : 0
  );

  useEffect(() => {
    if (!device.isOn || !device.turnedOnAt) { setElapsedMs(0); return; }
    const start = new Date(device.turnedOnAt).getTime();
    setElapsedMs(Date.now() - start);
    const interval = setInterval(() => setElapsedMs(Date.now() - start), 1000);
    return () => clearInterval(interval);
  }, [device.isOn, device.turnedOnAt]);

  const sessionKwh = ((device.wattage / 1000) * (elapsedMs / 3_600_000)).toFixed(3);
  const totalKwh = ((device.wattage / 1000) * device.dailyHours).toFixed(2);

  return (
    <Card className={`transition-all ${device.isOn ? "border-primary" : "border-border"}`}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{CATEGORY_ICON[device.category]}</span>
            <div>
              <p className="font-medium text-sm">{device.name}</p>
              <Badge className={`text-xs mt-1 ${CATEGORY_COLOR[device.category]}`}>
                {device.category.replace("_", " ")}
              </Badge>
            </div>
          </div>
          <button
            onClick={() => onDelete(device.id)}
            disabled={isPending}
            className="text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{device.wattage}W</span>
          <Button
            size="sm"
            disabled={isPending}
            onClick={() => onToggle(device.id, !device.isOn)}
            className={device.isOn ? "bg-primary hover:bg-primary/90 text-primary-foreground" : ""}
            variant={device.isOn ? "default" : "outline"}
          >
            {device.isOn ? "On" : "Off"}
          </Button>
        </div>

        {device.isOn ? (
          <div className="rounded-md bg-primary/10 px-3 py-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Active for</span>
              <span className="font-semibold tabular-nums">{formatElapsed(elapsedMs)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Session usage</span>
              <span className="font-semibold">{sessionKwh} kWh</span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Today: {totalKwh} kWh accumulated</p>
        )}
      </CardContent>
    </Card>
  );
}
