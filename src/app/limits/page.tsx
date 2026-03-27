"use client";

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  getDashboardData,
  getLimitHistory,
  upsertMonthlyLimit,
} from "@/lib/actions/energy-actions";
import { AlertTriangle, CheckCircle, Settings, History } from "lucide-react";

const DEMO_USER_ID = "user_1";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function LimitsPage() {
  const now = new Date();
  const [kWhLimit, setKWhLimit] = useState("");
  const [costLimit, setCostLimit] = useState("");
  const [threshold, setThreshold] = useState("80");
  const [currentUsage, setCurrentUsage] = useState({ kWh: 0, cost: 0 });
  const [activeLimit, setActiveLimit] = useState<{
    kWhLimit?: number | null;
    costLimit?: number | null;
    alertThreshold: number;
  } | null>(null);
  const [history, setHistory] = useState<
    { id: string; year: number; month: number; kWhLimit?: number | null; costLimit?: number | null; alertThreshold: number }[]
  >([]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function load() {
      const [dash, hist] = await Promise.all([
        getDashboardData(DEMO_USER_ID),
        getLimitHistory(DEMO_USER_ID),
      ]);
      setCurrentUsage(dash.monthlyUsage);
      if (dash.currentLimit) {
        setActiveLimit(dash.currentLimit);
        setKWhLimit(dash.currentLimit.kWhLimit?.toString() ?? "");
        setCostLimit(dash.currentLimit.costLimit?.toString() ?? "");
        setThreshold(dash.currentLimit.alertThreshold.toString());
      }
      setHistory(hist);
    }
    load();
  }, []);

  function handleSave() {
    setError("");
    setSaved(false);

    const kwh = kWhLimit ? parseFloat(kWhLimit) : undefined;
    const cost = costLimit ? parseFloat(costLimit) : undefined;
    const thresh = parseFloat(threshold);

    if (!kwh && !cost) {
      setError("Set at least one limit (kWh or cost).");
      return;
    }
    if (thresh < 1 || thresh > 100) {
      setError("Alert threshold must be between 1 and 100.");
      return;
    }

    startTransition(async () => {
      await upsertMonthlyLimit(DEMO_USER_ID, {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        kWhLimit: kwh,
        costLimit: cost,
        alertThreshold: thresh,
      });
      setActiveLimit({ kWhLimit: kwh, costLimit: cost, alertThreshold: thresh });
      setSaved(true);
    });
  }

  const kwhPct = activeLimit?.kWhLimit
    ? Math.min(100, (currentUsage.kWh / activeLimit.kWhLimit) * 100)
    : null;
  const costPct = activeLimit?.costLimit
    ? Math.min(100, (currentUsage.cost / activeLimit.costLimit) * 100)
    : null;

  function statusBadge(pct: number, threshold: number) {
    if (pct >= 100) return <Badge variant="destructive">Exceeded</Badge>;
    if (pct >= threshold) return <Badge className="bg-yellow-500 text-white">Warning</Badge>;
    return <Badge className="bg-green-600 text-white">On Track</Badge>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Limit Management</h1>
              <p className="text-sm text-muted-foreground">
                Set your monthly usage and budget limits
              </p>
            </div>
            <nav className="flex items-center gap-4">
              <a href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary">Dashboard</a>
              <a href="/limits" className="text-sm font-medium text-primary">Limits</a>
              <a href="/rewards" className="text-sm font-medium text-muted-foreground hover:text-primary">Rewards</a>
              <a href="/devices" className="text-sm font-medium text-muted-foreground hover:text-primary">Devices</a>
              <a href="/insights" className="text-sm font-medium text-muted-foreground hover:text-primary">Insights</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Configure Limit */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {MONTHS[now.getMonth()]} {now.getFullYear()} Limit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {saved && (
                <Alert className="border-green-500">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    Limit saved successfully!
                  </AlertDescription>
                </Alert>
              )}
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">
                  Monthly kWh Limit
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 800"
                    value={kWhLimit}
                    onChange={(e) => setKWhLimit(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <span className="absolute right-3 top-2 text-sm text-muted-foreground">kWh</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Monthly Budget Limit
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-sm text-muted-foreground">$</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 120"
                    value={costLimit}
                    onChange={(e) => setCostLimit(e.target.value)}
                    className="w-full rounded-md border border-input bg-background pl-6 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Alert Threshold: <span className="text-primary font-semibold">{threshold}%</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="95"
                  step="5"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>50%</span>
                  <span>Alert me when I reach this % of my limit</span>
                  <span>95%</span>
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={isPending}
                className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isPending ? "Saving..." : "Save Limit"}
              </button>
            </CardContent>
          </Card>

          {/* Current Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Current Month Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!activeLimit ? (
                <p className="text-sm text-muted-foreground">No limit set yet. Configure one on the left.</p>
              ) : (
                <>
                  {kwhPct !== null && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Energy Usage</span>
                        {statusBadge(kwhPct, activeLimit.alertThreshold)}
                      </div>
                      <Progress value={kwhPct} className="h-3" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{currentUsage.kWh.toFixed(1)} kWh used</span>
                        <span>{activeLimit.kWhLimit} kWh limit</span>
                      </div>
                      {kwhPct >= activeLimit.alertThreshold && kwhPct < 100 && (
                        <Alert className="border-yellow-500 py-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          <AlertDescription className="text-yellow-700 text-xs">
                            You've used {kwhPct.toFixed(0)}% of your kWh limit this month.
                          </AlertDescription>
                        </Alert>
                      )}
                      {kwhPct >= 100 && (
                        <Alert variant="destructive" className="py-2">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription className="text-xs">
                            You've exceeded your monthly kWh limit!
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}

                  {costPct !== null && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Budget</span>
                        {statusBadge(costPct, activeLimit.alertThreshold)}
                      </div>
                      <Progress value={costPct} className="h-3" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>${currentUsage.cost.toFixed(2)} spent</span>
                        <span>${activeLimit.costLimit} budget</span>
                      </div>
                      {costPct >= activeLimit.alertThreshold && costPct < 100 && (
                        <Alert className="border-yellow-500 py-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          <AlertDescription className="text-yellow-700 text-xs">
                            You've used {costPct.toFixed(0)}% of your monthly budget.
                          </AlertDescription>
                        </Alert>
                      )}
                      {costPct >= 100 && (
                        <Alert variant="destructive" className="py-2">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription className="text-xs">
                            You've exceeded your monthly budget!
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Limit History */}
        {history.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Limit History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground">
                      <th className="pb-2 text-left font-medium">Month</th>
                      <th className="pb-2 text-right font-medium">kWh Limit</th>
                      <th className="pb-2 text-right font-medium">Budget</th>
                      <th className="pb-2 text-right font-medium">Alert At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h) => (
                      <tr key={h.id} className="border-b last:border-0">
                        <td className="py-2">{MONTHS[h.month - 1]} {h.year}</td>
                        <td className="py-2 text-right">{h.kWhLimit ? `${h.kWhLimit} kWh` : "—"}</td>
                        <td className="py-2 text-right">{h.costLimit ? `$${h.costLimit}` : "—"}</td>
                        <td className="py-2 text-right">{h.alertThreshold}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
