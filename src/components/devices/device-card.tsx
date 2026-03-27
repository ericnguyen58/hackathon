"use client";

import { Device, DeviceCategory } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Thermometer, Lightbulb, WashingMachine, Monitor, Car, Plug, Trash2,
} from "lucide-react";

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

interface DeviceCardProps {
  device: Device;
  onToggle: (id: string, isOn: boolean) => void;
  onUpdateHours: (id: string, hours: number) => void;
  onDelete: (id: string) => void;
  isPending: boolean;
}

export function DeviceCard({ device, onToggle, onUpdateHours, onDelete, isPending }: DeviceCardProps) {
  const dailyKwh = ((device.wattage / 1000) * device.dailyHours).toFixed(2);

  return (
    <Card className={`transition-all ${device.isOn ? "border-green-400" : "border-border"}`}>
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
            className={device.isOn ? "bg-green-500 hover:bg-green-600 text-white" : ""}
            variant={device.isOn ? "default" : "outline"}
          >
            {device.isOn ? "On" : "Off"}
          </Button>
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="text-muted-foreground">Hrs/day</label>
          <input
            type="number"
            min={0}
            max={24}
            step={0.5}
            defaultValue={device.dailyHours}
            onBlur={(e) => onUpdateHours(device.id, parseFloat(e.target.value) || 0)}
            className="w-16 text-right border rounded px-1 py-0.5 text-xs bg-background"
          />
        </div>

        <p className="text-xs text-muted-foreground">~{dailyKwh} kWh/day</p>
      </CardContent>
    </Card>
  );
}
