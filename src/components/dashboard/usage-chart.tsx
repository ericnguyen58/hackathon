"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface UsageChartProps {
  data: Array<{
    date: string;
    kWh: number;
    cost: number;
  }>;
  type?: "kWh" | "cost";
}

export function UsageChart({ data, type = "kWh" }: UsageChartProps) {
  const color = type === "kWh" ? "#3b82f6" : "#10b981";
  const name = type === "kWh" ? "kWh" : "Cost ($)";

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`color${type}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            fontSize={12}
            className="text-muted-foreground"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            fontSize={12}
            className="text-muted-foreground"
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <p className="text-sm font-medium">{payload[0].payload.date}</p>
                    <p className="text-sm text-muted-foreground">
                      {name}: {payload[0].value}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey={type}
            stroke={color}
            strokeWidth={2}
            fill={`url(#color${type})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
