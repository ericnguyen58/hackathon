"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Zap, DollarSign } from "lucide-react";

interface StatsCardsProps {
  monthlyKwh: number;
  monthlyCost: number;
  previousMonthKwh?: number;
  previousMonthCost?: number;
}

export function StatsCards({
  monthlyKwh,
  monthlyCost,
  previousMonthKwh = 750,
  previousMonthCost = 110,
}: StatsCardsProps) {
  const kwhChange = previousMonthKwh
    ? ((monthlyKwh - previousMonthKwh) / previousMonthKwh) * 100
    : 0;
  const costChange = previousMonthCost
    ? ((monthlyCost - previousMonthCost) / previousMonthCost) * 100
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Monthly Usage
          </CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{monthlyKwh.toFixed(1)} kWh</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            {kwhChange <= 0 ? (
              <>
                <TrendingDown className="h-3 w-3 text-green-500" />
                <span className="text-green-600">{Math.abs(kwhChange).toFixed(1)}%</span>
              </>
            ) : (
              <>
                <TrendingUp className="h-3 w-3 text-red-500" />
                <span className="text-red-600">+{kwhChange.toFixed(1)}%</span>
              </>
            )}
            {" "}from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Monthly Cost
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${monthlyCost.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            {costChange <= 0 ? (
              <>
                <TrendingDown className="h-3 w-3 text-green-500" />
                <span className="text-green-600">{Math.abs(costChange).toFixed(1)}%</span>
              </>
            ) : (
              <>
                <TrendingUp className="h-3 w-3 text-red-500" />
                <span className="text-red-600">+{costChange.toFixed(1)}%</span>
              </>
            )}
            {" "}from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Avg Daily Usage
          </CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(monthlyKwh / 30).toFixed(1)} kWh
          </div>
          <p className="text-xs text-muted-foreground">
            Per day this month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Projected Cost
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${(monthlyCost * 1).toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            End of month estimate
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
