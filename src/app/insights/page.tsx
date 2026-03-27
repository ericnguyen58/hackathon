export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeviceBreakdownChart } from "@/components/insights/device-breakdown-chart";
import { DeviceInsightsList } from "@/components/insights/device-insights-list";
import { getEnergyInsights } from "@/lib/actions/device-actions";
import { Zap, DollarSign, BarChart3 } from "lucide-react";

const DEMO_USER_ID = "user_1";

export default async function InsightsPage() {
  const { devices, byCategory, totals } = await getEnergyInsights(DEMO_USER_ID);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Energy Insights</h1>
              <p className="text-sm text-muted-foreground">Estimated per-device energy usage</p>
            </div>
            <nav className="flex items-center gap-4">
              <a href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary">Dashboard</a>
              <a href="/limits" className="text-sm font-medium text-muted-foreground hover:text-primary">Limits</a>
              <a href="/rewards" className="text-sm font-medium text-muted-foreground hover:text-primary">Rewards</a>
              <a href="/devices" className="text-sm font-medium text-muted-foreground hover:text-primary">Devices</a>
              <a href="/insights" className="text-sm font-medium text-primary">Insights</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full"><Zap className="h-5 w-5 text-blue-600" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Est. Monthly Usage</p>
                <p className="text-2xl font-bold">{totals.monthlyKwh.toFixed(1)}<span className="text-sm font-normal text-muted-foreground"> kWh</span></p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full"><DollarSign className="h-5 w-5 text-green-600" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Est. Monthly Cost</p>
                <p className="text-2xl font-bold">${totals.monthlyCost.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full"><BarChart3 className="h-5 w-5 text-purple-600" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Devices Tracked</p>
                <p className="text-2xl font-bold">{devices.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart + List */}
        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Usage by Category</CardTitle></CardHeader>
            <CardContent>
              <DeviceBreakdownChart data={byCategory} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Top Energy Consumers</CardTitle></CardHeader>
            <CardContent>
              <DeviceInsightsList devices={devices} totalMonthlyKwh={totals.monthlyKwh} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
