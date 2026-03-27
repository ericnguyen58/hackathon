import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface DeviceWithStats {
  id: string;
  name: string;
  category: string;
  wattage: number;
  dailyHours: number;
  isOn: boolean;
  monthlyKwh: number;
  monthlyCost: number;
}

interface Props {
  devices: DeviceWithStats[];
  totalMonthlyKwh: number;
}

export function DeviceInsightsList({ devices, totalMonthlyKwh }: Props) {
  const sorted = [...devices].sort((a, b) => b.monthlyKwh - a.monthlyKwh);

  return (
    <div className="space-y-4">
      {sorted.map((d) => {
        const pct = totalMonthlyKwh > 0 ? (d.monthlyKwh / totalMonthlyKwh) * 100 : 0;
        return (
          <div key={d.id} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">{d.name}</span>
                <Badge variant="outline" className="text-xs">{d.category.replace("_", " ")}</Badge>
                {d.isOn && <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />}
              </div>
              <div className="text-right text-muted-foreground text-xs">
                <span>{d.monthlyKwh.toFixed(1)} kWh</span>
                <span className="ml-2">${d.monthlyCost.toFixed(2)}</span>
              </div>
            </div>
            <Progress value={pct} className="h-2" />
          </div>
        );
      })}
    </div>
  );
}
