"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS: Record<string, string> = {
  HVAC:        "#3b82f6",
  APPLIANCE:   "#8b5cf6",
  LIGHTING:    "#eab308",
  ELECTRONICS: "#6366f1",
  EV_CHARGER:  "#22c55e",
  OTHER:       "#6b7280",
};

interface Props {
  data: { category: string; monthlyKwh: number; monthlyCost: number }[];
}

export function DeviceBreakdownChart({ data }: Props) {
  const chartData = data.map((d) => ({
    name: d.category.replace("_", " "),
    value: Math.round(d.monthlyKwh * 10) / 10,
    category: d.category,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={110}
          paddingAngle={3}
          dataKey="value"
          label={({ name, percent }) => `${name ?? ""} ${(((percent as number) ?? 0) * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {chartData.map((entry) => (
            <Cell key={entry.category} fill={COLORS[entry.category] ?? "#6b7280"} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} kWh`, "Monthly Usage"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
